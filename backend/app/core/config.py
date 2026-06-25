from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    groq_api_key: str = "your_groq_api_key_here"
    groq_model: str = "llama-3.3-70b-versatile"
    groq_base_url: str = "https://api.groq.com/openai/v1"
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    app_env: str = "development"

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()
