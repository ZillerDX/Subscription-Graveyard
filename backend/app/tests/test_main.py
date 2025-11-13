"""
Tests for main application endpoints
"""
import pytest
from fastapi.testclient import TestClient


def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "healthy"
    assert "message" in data
    assert "version" in data
    assert data["version"] == "1.0.0"


def test_root_endpoint(client):
    """Test the root endpoint"""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()

    assert "message" in data
    assert "version" in data
    assert "docs" in data
    assert "health" in data
    assert data["docs"] == "/docs"
