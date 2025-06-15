from typing import Literal
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv
import os
load_dotenv()

LlmSources = Literal["openai", "mistral", "huggingface", "anthropic", "groq", "gemini"]

class LLMConfig:
    def __init__(
            self,
            source: LlmSources = "anthropic",
            model_name: str = "claude-3-7-sonnet-latest",
            temperature: float = 0.0,
            max_retries: int = 2,
            ):
        self.source = source
        self.model_name = model_name
        self.temperature = temperature
        self.max_retries = max_retries
        self.model = None

    def get_model(self):
        return self.model_name
    
    def to_llm(self):
        match self.source:
            case "mistral":
                llm = ChatMistralAI(
                    model=self.model_name,
                    temperature=self.temperature,
                    max_retries=self.max_retries
                )
            case "gemini": 
                llm = ChatGoogleGenerativeAI(
                    model=self.model_name,
                    temperature=0,
                    max_tokens=None,
                    timeout=None,
                    max_retries=2,
                )
            case "anthropic":
                llm = ChatAnthropic(
                    model="claude-3-7-sonnet-latest",
                    api_key=os.getenv("ANTHROPIC_API_KEY"),
                    temperature=self.temperature,
                    max_retries=self.max_retries
                )
            case _:
                raise ValueError(f"Source {self.source} not supported")
            
        return llm