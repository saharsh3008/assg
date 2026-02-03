import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class Settings:
    PROJECT_NAME: str = "Healthcare GenAI Assistant"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    CHROMA_PERSIST_DIRECTORY: str = os.path.join(os.getcwd(), "chroma_db")
    UPLOAD_FOLDER: str = os.path.join(os.getcwd(), "uploads")

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
