from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    deepseek_api_key: str
    deepseek_base_url: str = "https://api.deepseek.com/v1"
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    max_file_size: int = 10485760  # 10MB
    upload_dir: str = "uploads"
    
    class Config:
        env_file = ".env"


settings = Settings()
