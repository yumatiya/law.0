from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class OCRRequest(BaseModel):
    image_url: str

class OCRResponse(BaseModel):
    text: str

@router.post("/ocr/extract", response_model=OCRResponse)
async def extract_text(request: OCRRequest):
    """
    Endpoint to extract text content from an image URL.
    Placeholder implementation.
    """
    if not request.image_url:
        raise HTTPException(status_code=400, detail="Image URL is required")
    
    # Placeholder extracted text
    extracted_text = "Sample extracted text from the image."

    return OCRResponse(text=extracted_text)
