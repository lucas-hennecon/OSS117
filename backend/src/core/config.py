from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Artist Website"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 