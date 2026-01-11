from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    A sample chat API endpoint that echoes back the user's message.
    """
    user_message = request.message
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Simple echo response for example
    response_text = f"Received: {user_message}"

    return ChatResponse(reply=response_text)
