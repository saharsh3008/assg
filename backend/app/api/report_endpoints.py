from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.report_generator import ReportGenerator
from fastapi.responses import FileResponse
import os
from app.core.config import settings

router = APIRouter()
report_generator = ReportGenerator()

class ReportRequest(BaseModel):
    sections: List[str]

@router.post("/generate_report")
async def generate_report(request: ReportRequest):
    try:
        result = await report_generator.generate_report(request.sections)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(settings.UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    raise HTTPException(status_code=404, detail="File not found")
