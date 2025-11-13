"""
Application configuration settings using Pydantic Settings
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings"""

    # API Settings
    PROJECT_NAME: str = "Subscription Graveyard API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # Database Settings
    DATABASE_URL: str = "postgresql://subgraveyard:dev_password_123@localhost:5432/subscription_graveyard_dev"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    # JWT Settings
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-this-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # CORS Settings
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000"

    @field_validator("CORS_ORIGINS")
    @classmethod
    def parse_cors_origins(cls, v: str) -> List[str]:
        """Convert comma-separated string to list"""
        return [origin.strip() for origin in v.split(",")]

    # Security Settings
    BCRYPT_ROUNDS: int = 12

    # Application Settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env


# Create global settings instance
settings = Settings()
