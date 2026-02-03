from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints, report_endpoints

app = FastAPI(title="Healthcare GenAI Assistant", description="API for Q&A and Report Generation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")
app.include_router(report_endpoints.router, prefix="/api/report")

@app.get("/")
async def root():
    return {"message": "Healthcare GenAI Assistant API is operational", "docs_url": "/docs"}
