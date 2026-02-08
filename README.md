# Healthcare GenAI Assistant

A powerful, local-first RAG (Retrieval Augmented Generation) system designed for analyzing medical documents. It allows users to upload patient records (PDF, TXT, DOCX), ask interactive questions with source citations, and generate structured medical reports.

![Healthcare GenAI Assistant](https://via.placeholder.com/800x400?text=Healthcare+GenAI+Assistant+Screenshot)
*(Note: Replace with actual screenshot path if available)*

## 🚀 Features

-   **Multi-Model Support**: Seamlessly switch between **OpenAI (GPT-4)** and **Groq (Llama 3)** for high-speed inference.
-   **Local Embeddings**: Uses HuggingFace embeddings (`all-MiniLM-L6-v2`) locally to avoid API costs and quota limits for document processing.
-   **Document Ingestion**: Upload multiple files simultaneously (PDF, DOCX, TXT).
-   **Interactive Q&A**: Chat with your documents. Responses include citations (`📚 Sources`) pointing to the specific documents used.
-   **Report Generation**: Automatically generate structured PDFs (Patient Summary, Clinical Findings, etc.) based on the ingested data.
-   **Agentic Workflow**: Implements a ReAct (Reasoning + Acting) agent that intelligently reads and extracts data for precise report creation.
-   **Modern UI**: A clean, responsive Dark Mode interface built with vanilla HTML/JS (no complex build steps required).

## 🛠️ Tech Stack

-   **Backend**: FastAPI, Python 3.9+
-   **AI/ML**: LangChain, ChromaDB, HuggingFace, OpenAI / Groq
-   **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (Vanilla)

## ⚡ Quick Start

### 1. Prerequisites
-   Python 3.9+ installed.
-   An API Key for **OpenAI** OR **Groq**.

### 2. Installation

 Clone the repository and navigate to the project root:
 ```bash
 cd healthcare_genai_assistant
 ```

### 3. Configuration

Open the `.env` file in the root directory and add your API keys:

```env
# Primary LLM Choice (Recommended for Speed)
GROQ_API_KEY=gsk_your_groq_key_here...

# Fallback / Alternative
OPENAI_API_KEY=sk-proj-your_openai_key_here...
```
*Note: If `GROQ_API_KEY` is present, the system defaults to using Groq (Llama 3) and Local Embeddings.*

### 4. Running the Application

You need to run the Backend and Frontend in separate terminal windows.

**Backend (Terminal 1):**
```bash
cd backend
# Create virtual environment (if not already done)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install langchain-groq sentence-transformers  # Ensure new deps are installed

# Start Server
uvicorn app.main:app --reload
```
*Backend runs at `http://localhost:8000`*

**Frontend (Terminal 2):**
```bash
cd simple_frontend
python3 -m http.server 8001
```
*Frontend runs at `http://localhost:8001`*

## 📚 Usage Guide

1.  **Open the App**: Go to [http://localhost:8001](http://localhost:8001).
2.  **Upload Docs**: Drag & drop multiple patient files into the "Document Ingestion" box.
3.  **Chat**: Type standard questions like *"What is the patient's diagnosis?"*. The AI will answer and list the source files.
4.  **Generate Report**: Select the sections you want (e.g., "Patient Summary") and click "Generate Report". A PDF will be created.

## 🤝 Troubleshooting

-   **Error 429 (Quota Exceeded)**: This usually happens with OpenAI keys. Switch to Groq by adding a `GROQ_API_KEY` to your `.env` file.
-   **"Failed to fetch"**: Ensure the Backend is running on port 8000.
