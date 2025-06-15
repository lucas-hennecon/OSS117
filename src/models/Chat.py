from pydantic import BaseModel, Field
import uuid
from typing import List, Literal
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from datetime import datetime


class Message(BaseModel):
    content: str
    role: Literal["human", "assistant"]
    timestamp: datetime = datetime.now()
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    class Config:
        from_attributes = True
    
    def to_base_message(self) -> BaseMessage:
        match self.role:
            case "human":
                return HumanMessage(content=self.content)
            case "assistant":
                return AIMessage(content=self.content)

class Conversation(BaseModel):
    messages: List[Message]
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    def to_base_messages(self) -> List[BaseMessage]:
        return [message.to_base_message() for message in self.messages]
    

class fact_checked(BaseModel):
    fact: str
    answer: str

class FactCheckingResponse(BaseModel):
    facts_checked: List[fact_checked]