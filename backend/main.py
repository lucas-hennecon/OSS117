from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.controllers import chat_controller
from src.controllers import speech_controller
import uvicorn

app = FastAPI(
    title="fact checker API",
    description="Backend API for the Legira",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
app.include_router(chat_controller.router, prefix="/api/chat", tags=["chat"])
app.include_router(speech_controller.router, prefix="/api/speech", tags=["speech"])

@app.get("/")
async def root():
    return {"message": "Welcome to the fact-check API"}

import os
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
