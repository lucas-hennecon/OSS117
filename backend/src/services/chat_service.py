from loguru import logger
from src.chat.agents.rag.fact_checker import FactChecker
from src.models.Chat import FactCheckingResponse, fact_checked
import re

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
            facts_checked = []
            for fact in answer:
                facts_checked.append(fact_checked(
                    fact=fact["fact"],
                    answer=fact["answer"]
                ))
            return FactCheckingResponse(facts_checked=facts_checked)
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            raise e