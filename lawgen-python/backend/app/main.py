from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import retrieve_documents, generate_answer

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8082", "http://127.0.0.1:8082"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class VoiceRequest(BaseModel):
    text: str

class TTSRequest(BaseModel):
    text: str

class OCRRequest(BaseModel):
    image_url: str

class JudgeRequest(BaseModel):
    case_details: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # Retrieve relevant documents
    documents = retrieve_documents(request.message)

    # Generate answer using RAG
    answer = generate_answer(documents, request.message)

    return {"reply": answer}

@app.post("/voice/generate")
async def generate_voice(request: VoiceRequest):
    # Dummy response for voice generation
    return {"audio_url": "https://example.com/audio/voice.mp3"}

@app.post("/tts/generate")
async def generate_tts(request: TTSRequest):
    # Dummy response for TTS generation
    return {"audio_url": "https://example.com/audio/tts.mp3"}

@app.post("/ocr/extract")
async def extract_ocr(request: OCRRequest):
    # Dummy response for OCR extraction
    return {"text": "Extracted text from image"}

@app.post("/judge/verdict")
async def judge_verdict(request: JudgeRequest):
    # Dummy response for judge verdict
    return {"verdict": "Guilty"}
