from fastapi.testclient import TestClient
from lawgen_python.backend.app.main import app

client = TestClient(app)

def test_login_success():
    response = client.post("/auth/login", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data
    assert "token_type" in json_data

def test_login_failure_invalid_credentials():
    response = client.post("/auth/login", json={"username": "baduser", "password": "badpass"})
    assert response.status_code == 401

def test_access_protected_route_with_token():
    login_response = client.post("/auth/login", json={"username": "testuser", "password": "testpass"})
    token = login_response.json().get("access_token")

    headers = {"Authorization": f"Bearer {token}"}
    protected_response = client.get("/protected-route", headers=headers)
    assert protected_response.status_code == 200

def test_access_protected_route_without_token():
    response = client.get("/protected-route")
    assert response.status_code == 401

def test_token_expiry_and_refresh():
    # Placeholder: Implement test for token expiry and refresh flow if supported
    pass
