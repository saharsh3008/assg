from langchain.tools import BaseTool
from typing import Optional, Type
from pydantic import BaseModel, Field
from app.services.rag_service import RAGService

class SectionInput(BaseModel):
    section_name: str = Field(description="The name of the section to write (e.g., 'Introduction', 'Clinical Findings')")
    requirements: str = Field(description="Specific instructions for this section")

class SectionWriterTool(BaseTool):
    name: str = "section_writer"
    description: str = "Writes a specific section of a medical report based on the provided documents. Use this for text generation."
    args_schema: Type[BaseModel] = SectionInput
    rag_service: Optional[RAGService] = None

    class Config:
        arbitrary_types_allowed = True

    def _run(self, section_name: str, requirements: str):
        # Determine if we need exact extraction or summary
        if "exact" in requirements.lower() or "extract" in requirements.lower():
            prompt_prefix = "Strictly extract and quote the following information from the documents. Do not summarize or paraphrase unless necessary. Information to extract: "
        else:
            prompt_prefix = "Summarize and write a detailed section about: "
            
        initial_query = f"{prompt_prefix} {section_name}. Context/Requirements: {requirements}"
        
        # We perform a RAG query to get the content
        try:
            result = self.rag_service.query_sync(initial_query)
            return result['answer']
        except Exception as e:
            return f"Error gathering data for {section_name}: {str(e)}"

    def _arun(self, section_name: str, requirements: str):
        raise NotImplementedError("Async not implemented")

class TableExtractionTool(BaseTool):
    name: str = "table_extractor"
    description: str = "Extracts tables or structured data from documents for the report."
    args_schema: Type[BaseModel] = SectionInput
    rag_service: Optional[RAGService] = None
    
    class Config:
        arbitrary_types_allowed = True

    def _run(self, section_name: str, requirements: str):
        query = f"Find data regarding '{section_name}' and formatted it as a clean Markdown table. {requirements}"
        try:
            result = self.rag_service.query_sync(query)
            return result['answer']
        except Exception as e:
            return "No structured data found to create a table."

    def _arun(self, section_name: str, requirements: str):
         raise NotImplementedError("Async not implemented")
