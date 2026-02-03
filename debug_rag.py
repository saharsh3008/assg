
import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.rag_service import RAGService
from app.core.config import settings

async def main():
    print(f"API Key present: {bool(settings.OPENAI_API_KEY)}")
    print(f"Key start: {settings.OPENAI_API_KEY[:10]}...")
    
    try:
        rag = RAGService()
        print("RAG Service initialized.")
        
        response = await rag.query("Test query")
        print("Query successful:", response)
    except Exception as e:
        print("Error encountered:")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
