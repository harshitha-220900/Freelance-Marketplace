"""
config.py – Application configuration loaded from environment variables.
Uses pydantic-settings so values can also come from a .env file.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings, populated by environment variables or a .env file.
    """
    # ── Database ──────────────────────────────────────────────
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./freelance.db",
        description="The database connection URL."
    )

    # ── JWT Auth ──────────────────────────────────────────────
    SECRET_KEY: str = Field(
        default="CHANGE_ME_IN_PRODUCTION_super_secret_key_123",
        description="Secret key used for signing JWT tokens."
    )
    ALGORITHM: str = Field(
        default="HS256",
        description="Cryptographic algorithm used for JWT."
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=1440,
        description="Access token expiration time in minutes (default 24h)."
    )

    # ── App ───────────────────────────────────────────────────
    APP_NAME: str = Field(
        default="Freelance Marketplace API",
        description="The name of the application."
    )
    DEBUG: bool = Field(
        default=True,
        description="Enable debug mode, useful for verbose logging."
    )
    ALLOWED_ORIGINS: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="List of allowed CORS origins."
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


# Single shared instance imported everywhere
settings = Settings()
