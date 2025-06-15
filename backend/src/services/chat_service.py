from loguru import logger
from src.chat.agents.rag.fact_checker import FactChecker
from src.models.Chat import FactCheckingResponse, fact_checked

class ChatService:
    def __init__(self):
        self.fact_checker = FactChecker()
    def answer_input_text(self, input_text: str) -> FactCheckingResponse:
        """
        Process an incoming message and generate a response.
        
        Args:
            message: The incoming message from the user
            selectedLegislations: The legislations to use for the RAG agent
            
        Returns:
            Message: The assistant's response
        """
        try:
            answer = self.fact_checker.answer_messages([input_text])
            # Mock data for testing
            # facts_checked = [
            #     fact_checked(
            #         statement="The Earth orbits around the Sun",
            #         explanation="This is a fundamental astronomical fact that has been well-established through centuries of scientific observation and research.",
            #         confidence=98,
            #         classification="green",
            #         sources={
            #             "supporting": [],
            #             "contradicting": [],
            #             "nuanced": []
            #         }
            #     )
            # ]
            facts_checked = []
            for fact in answer:
                facts_checked.append(fact_checked(
                    statement=fact["statement"],
                    explanation=fact["explanation"],
                    confidence=fact["confidence"],
                    classification=fact["classification"],
                    sources=fact["sources"]
                ))
            return FactCheckingResponse(facts_checked=facts_checked)
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            raise e