from fastapi.testclient import TestClient
from lawgen_python.backend.app.main import app

client = TestClient(app)

def test_chat_endpoint():
    response = client.post("/chat", json={"message": "Hello"})
    assert response.status_code == 200
    assert "reply" in response.json()

def test_generate_voice():
    response = client.post("/voice/generate", json={"text": "Test voice"})
    assert response.status_code == 200
    assert "audio_url" in response.json()

def test_generate_tts():
    response = client.post("/tts/generate", json={"text": "Test tts"})
    assert response.status_code == 200
    assert "audio_url" in response.json()

def test_extract_ocr():
    response = client.post("/ocr/extract", json={"image_url": "https://example.com/image.jpg"})
    assert response.status_code == 200
    assert "text" in response.json()

def test_judge_verdict():
    response = client.post("/judge/verdict", json={"case_details": "Test case"})
    assert response.status_code == 200
    assert "verdict" in response.json()
