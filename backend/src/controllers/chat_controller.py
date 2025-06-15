from fastapi import APIRouter, Depends
from src.services.chat_service import ChatService
from pydantic import BaseModel
from src.models.Chat import FactCheckingResponse
from loguru import logger
from typing import List

router = APIRouter()

def get_chat_service() -> ChatService:
    """Dependency injection for ChatService."""
    return ChatService()

class InputTextRequest(BaseModel):
    input_text: str

@router.post("/", response_model=FactCheckingResponse)
async def answer_conversation(
    input_text: InputTextRequest,
    chat_service: ChatService = Depends(get_chat_service),
) -> FactCheckingResponse:
    """
    Send a message to the chat and get a response.
    
    Args:
        message: The message to send
        chat_service: Injected chat service instance
        
    Returns:
        Message: The assistant's response
        
    Raises:
        HTTPException: If there's an error processing the message
    """
    try:
        message = chat_service.answer_input_text(input_text.input_text)
        return message
    except Exception as e:
        logger.error(f"Error in chat controller: {str(e)}")
        raise e