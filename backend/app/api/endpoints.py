from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.core.config import settings
from app.services.rag_service import RAGService
import shutil
import os
import uuid
from pydantic import BaseModel

router = APIRouter()
rag_service = RAGService()

class QueryRequest(BaseModel):
    question: str

from typing import List

@router.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    if not os.path.exists(settings.UPLOAD_FOLDER):
        os.makedirs(settings.UPLOAD_FOLDER)

    results = []
    
    for file in files:
        file_id = str(uuid.uuid4())
        safe_filename = os.path.basename(file.filename)
        file_location = os.path.join(settings.UPLOAD_FOLDER, f"{file_id}_{safe_filename}")
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            chunks = await rag_service.ingest_document(file_location, safe_filename)
            results.append({"filename": safe_filename, "status": "Ingested", "chunks": chunks})
        except Exception as e:
            if os.path.exists(file_location):
                os.remove(file_location)
            results.append({"filename": safe_filename, "status": "Failed", "error": str(e)})
            
    return {"results": results}


@router.post("/query")
async def query_knowledge_base(request: QueryRequest):
    try:
        response = await rag_service.query(request.question)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
