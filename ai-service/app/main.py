import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AI Recruitment Service",
    description="Python FastAPI service for AI-assisted recruitment workflows",
    version="0.1.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    service: str
    status: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        service="ai-service",
        status="UP",
        version="0.1.0",
    )


@app.get("/")
async def root():
    return {
        "message": "AI Recruitment Service is running",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    host = os.getenv("AI_SERVICE_HOST", "127.0.0.1")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
