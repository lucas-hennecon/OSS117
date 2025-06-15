from IPython.display import Image, display
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.types import Send
from langgraph.graph import END, START, StateGraph
from typing_extensions import List
from src.chat.llms.config import LLMConfig
from dotenv import load_dotenv
from src.chat.agents.rag.state import OverallState, FactCheckingState
from smolagents import ToolCallingAgent, InferenceClientModel, WebSearchTool
import json
from src.chat.agents.rag.prompts import smolagent_prompt
from loguru import logger
load_dotenv()


class FactChecker:
    def __init__(
        self,
        llm_config: LLMConfig | None = None,
    ):
        model = InferenceClientModel(
            model_id="Qwen/Qwen3-32B",
            provider="nebius",
            token="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",
            bill_to="agents-hack",
        )
        web_search_tool = WebSearchTool()
        self.code_agent = ToolCallingAgent(tools=[web_search_tool], model=model)

        if not llm_config:
            llm_config = LLMConfig()

        self.llm = llm_config.to_llm()

        self._create_workflow()

    def text_to_facts(self, state: OverallState)-> FactCheckingState:
        # TODO
        return {"facts": ["Hugging face headquarters is in Lebanon."]}

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
    

    def run_fact_checkers(self, state: FactCheckingState) -> OverallState:
        facts_checked = []
        for fact in state["facts"]:
            total_prompt = smolagent_prompt + fact
            fact_checked_answer = self.code_agent.run(total_prompt)
            if isinstance(fact_checked_answer, str):
                pass
            else:
                logger.critical(fact_checked_answer)
                raise ValueError(f"Unexpected type: {type(fact_checked_answer)}")
            facts_checked.append({"fact": fact, "answer": fact_checked_answer})
        return {"facts_checked": facts_checked}
        # return [
        #     Send(
        #         "fact_check",
        #         {
        #             "fact": fact,
        #         },
        #     )
        #     for _, fact in enumerate(state["facts"])
        # ]
    


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
