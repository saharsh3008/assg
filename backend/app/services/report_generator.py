from langchain.agents import initialize_agent, Tool, AgentType
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from app.services.rag_service import RAGService
from app.services.tools import SectionWriterTool, TableExtractionTool
from app.core.config import settings
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import os
import uuid

class ReportGenerator:
    def __init__(self):
        self.rag_service = RAGService()
        if settings.GROQ_API_KEY:
            self.llm = ChatGroq(temperature=0, model="llama-3.3-70b-versatile", groq_api_key=settings.GROQ_API_KEY)
        else:
            self.llm = ChatOpenAI(temperature=0, model="gpt-4", openai_api_key=settings.OPENAI_API_KEY)
        
        # Initialize Tools
        self.tools = [
            SectionWriterTool(rag_service=self.rag_service),
            TableExtractionTool(rag_service=self.rag_service)
        ]
        
        # Initialize Agent
        self.agent = initialize_agent(
            self.tools,
            self.llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

    async def generate_report(self, sections: list[str]):
        """Generates a PDF report based on requested sections."""
        report_content = {}
        
        # Generate content for each section using the Agent
        for section in sections:
            try:
                # Tailor instructions based on section name
                if "Summary" in section or "Introduction" in section:
                    requirements = "Summarize the key information clearly."
                    instruction = f"Write the '{section}' using the section_writer tool. Requirements: {requirements}"
                elif "Table" in section:
                    requirements = "Use table_extractor tool to create a markdown table."
                    instruction = f"Create a table for '{section}'. Requirements: {requirements}"
                else:
                    # Default to detailed extraction
                    requirements = "Extract and quote exact findings, do not rewrite content unless asking for summary."
                    instruction = f"Write the '{section}' using the section_writer tool. Requirements: {requirements}"

                query = f"{instruction} Use the medical documents provided."
                response = self.agent.run(query)
                report_content[section] = response
            except Exception as e:
                print(f"Report generation agent failed: {e}")
                report_content[section] = f"Error generating section {section}: {str(e)}"

            
        # Create PDF
        return self._create_pdf(report_content)

    def _create_pdf(self, content: dict):
        filename = f"medical_report_{uuid.uuid4()}.pdf"
        filepath = os.path.join(settings.UPLOAD_FOLDER, filename)
        
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        story.append(Paragraph("<b>Medical Analysis Report</b>", styles['Title']))
        story.append(Spacer(1, 12))
        
        for section, text in content.items():
            story.append(Paragraph(f"<b>{section}</b>", styles['Heading2']))
            story.append(Spacer(1, 6))
            # Handle newlines in text
            for line in text.split('\n'):
                if line.strip():
                    story.append(Paragraph(line, styles['Normal']))
            story.append(Spacer(1, 12))
            
        doc.build(story)
        return {"filename": filename, "filepath": filepath}
