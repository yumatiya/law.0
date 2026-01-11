from fastapi.testclient import TestClient
from lawgen_python.backend.app.main import app

client = TestClient(app)

def test_judge_verdict_success():
    response = client.post("/judge/verdict", json={"case_details": "Test case details"})
    assert response.status_code == 200
    json_data = response.json()
    assert "verdict" in json_data
    assert isinstance(json_data["verdict"], str)
    assert len(json_data["verdict"]) > 0

def test_judge_verdict_missing_case_details():
    response = client.post("/judge/verdict", json={})
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["detail"] == "Case details are required"
