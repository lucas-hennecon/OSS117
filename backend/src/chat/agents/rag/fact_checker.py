from IPython.display import Image, display
from typing import Any
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.types import Send
from langgraph.graph import END, START, StateGraph
from typing_extensions import List
from src.chat.llms.config import LLMConfig
from dotenv import load_dotenv
from src.chat.agents.rag.state import OverallState, FactCheckingState, FactList, FactCheckLevel
from smolagents import ToolCallingAgent, InferenceClientModel, WebSearchTool
import json
from src.chat.agents.rag.prompts import smolagent_prompt, text_to_facts_prompt, classification_prompt
from smolagents import LiteLLMModel
from loguru import logger
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
load_dotenv()


class FactChecker:
    def __init__(
        self,
        llm_config: LLMConfig | None = None,
    ):
        # model = InferenceClientModel(
        #     model_id="Qwen/Qwen3-32B",
        #     provider="nebius",
        #     token="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",
        #     bill_to="agents-hack",
        # )
        model = LiteLLMModel(model_id="claude-3-7-sonnet-latest")
        web_search_tool = WebSearchTool()
        self.code_agent = ToolCallingAgent(tools=[web_search_tool], model=model)

        if not llm_config:
            llm_config = LLMConfig()

        self.llm = llm_config.to_llm()
        self._create_workflow()

    def text_to_facts(self, state: OverallState)-> FactCheckingState:
        text_to_facts_prompt_formatted = text_to_facts_prompt.format(text=state["messages"][-1].content)
        facts = self.llm.with_structured_output(FactList).invoke(text_to_facts_prompt_formatted)
        logger.critical(f"Facts: {facts.facts}")
        return {"facts": facts.facts}

    def run_fact_check(self, fact: str):
        # TO PARALLELIZE !!
        fact_checked_answer = self.code_agent.run(fact)
        if isinstance(fact_checked_answer, str):
            fact_checked_answer = json.loads(fact_checked_answer, strict=False)
        elif isinstance(fact_checked_answer, dict):
            pass
        else:
            raise ValueError(f"Unexpected type: {type(fact_checked_answer)}")
        return {"facts_checked": fact_checked_answer}
    
    def classify_level(self, confidence: int):
        if confidence < 40:
            return "red"
        elif confidence < 70:
            return "yellow"
        else:
            return "green"
        
    def run_classification(self, fact_checked: dict[str, Any]):
        classification_prompt_extended = classification_prompt.format(statement=fact_checked["statement"], explanation=fact_checked["explanation"])
        classification = self.llm.with_structured_output(FactCheckLevel).invoke(classification_prompt_extended)

        return {"confidence": classification.level, "classification": self.classify_level(classification.level)}

    def _process_single_fact(self, fact: str) -> dict:
        model = InferenceClientModel(
            model_id="Qwen/Qwen3-32B",
            provider="nebius",
            token="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",
            bill_to="agents-hack",
        )
        web_search_tool = WebSearchTool()
        code_agent = ToolCallingAgent(tools=[web_search_tool], model=model, **{"max_steps": 3})
        total_prompt = smolagent_prompt + fact
        fact_checked_answer = code_agent.run(total_prompt)


        summarize_smolagent_prompt = smolagent_prompt + fact + "\n\n" + fact_checked_answer
        logger.critical(fact_checked_answer)
        fact_checked_answer = self.llm.invoke(summarize_smolagent_prompt)
    
        
        if isinstance(fact_checked_answer, str):
            fact_to_add = {
                "statement": fact,
                "explanation": fact_checked_answer,
            }
            classification = self.run_classification(fact_to_add)
            fact_to_add.update(classification)
            fact_to_add["sources"] = {
                    "supporting": [],
                    "contradicting": [],
                    "nuanced": []
                }
            return fact_to_add
        else:
            logger.critical(fact_checked_answer)
            # Handle unexpected response type
            return {
                "statement": fact,
                "explanation": "Error processing fact",
                "confidence": 0,
                "classification": "red",
                "sources": {
                    "supporting": [],
                    "contradicting": [],
                    "nuanced": []
                }
            }

    def run_fact_checkers(self, state: FactCheckingState) -> OverallState:
        facts_checked = []
        
        # Use ThreadPoolExecutor to parallelize fact processing
        max_workers = min(len(state["facts"]), 10)  # Limit to 10 concurrent workers
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            logger.critical(f"Running {max_workers} fact checkers")
            # Submit all facts for processing
            future_to_fact = {
                executor.submit(self._process_single_fact, fact): fact 
                for fact in state["facts"]
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_fact):
                fact = future_to_fact[future]
                try:
                    result = future.result()
                    facts_checked.append(result)
                    logger.debug(f"Completed fact checking for: {fact[:50]}...")
                except Exception as exc:
                    logger.error(f"Fact checking failed for '{fact[:50]}...': {exc}")
                    # Add error result
                    facts_checked.append({
                        "statement": fact,
                        "explanation": f"Error during fact checking: {exc}",
                        "confidence": 0,
                        "classification": "red",
                        "sources": {
                            "supporting": [],
                            "contradicting": [],
                            "nuanced": []
                        }
                    })
        
        return {"facts_checked": facts_checked}


    def _create_workflow(self):
        """Create the LangGraph workflow for the agent."""

        # Create our Agent Graph
        builder = StateGraph(OverallState)

        # Define the nodes we will cycle between
        builder.add_node("text_to_facts", self.text_to_facts)
        builder.add_node("run_fact_checkers", self.run_fact_checkers)

        # Set the entrypoint as `generate_query`
        # This means that this node is the first one called
        builder.add_edge(START, "text_to_facts")
        builder.add_edge("text_to_facts", "run_fact_checkers")
        builder.add_edge("run_fact_checkers", END)
        # Finalize the answer

        self.workflow = builder
        self.graph = builder.compile()

    def run_graph(self, message_history: List[str | BaseMessage]):
        logger.info("Starting RAG agent workflow")
        message_history = [
            HumanMessage(content=message) if isinstance(message, str) else message
            for message in message_history
        ]
        logger.debug(f"Processing {len(message_history)} messages")
        result = self.graph.invoke({"messages": message_history})
        logger.info("RAG agent workflow complete")
        return result
    
    def contact_checked_facts(self, checked_facts: List[dict]):
        # TODO
        all_answers = ("--------------\n\n").join([fact["answer"] for fact in checked_facts])
        return all_answers
    
    def answer_messages(
            self,
            message_history: List[str | BaseMessage],
        ) -> List[dict]:
        result = self.run_graph(message_history)
        checked_facts = result["facts_checked"]
        return checked_facts

    def plot(self):
        display(Image(self.graph.get_graph().draw_mermaid_png()))
