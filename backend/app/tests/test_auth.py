"""
Tests for authentication endpoints
"""
import pytest
from fastapi.testclient import TestClient


def test_register_success(client):
    """Test successful user registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )

    assert response.status_code == 201
    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0


def test_register_duplicate_email(client):
    """Test registration with duplicate email"""
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "password123"
        }
    )

    # Try to register with same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "differentpassword"
        }
    )

    assert response.status_code == 409
    assert "already registered" in response.json()["detail"].lower()


def test_register_invalid_email(client):
    """Test registration with invalid email format"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "notanemail",
            "password": "password123"
        }
    )

    assert response.status_code == 422  # Validation error


def test_register_short_password(client):
    """Test registration with password too short"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "short"
        }
    )

    assert response.status_code == 422  # Validation error


def test_login_success(client):
    """Test successful login"""
    # Register user first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """Test login with wrong password"""
    # Register user first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "user@example.com",
            "password": "correctpassword"
        }
    )

    # Try login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


def test_login_nonexistent_user(client):
    """Test login with non-existent user"""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 401


def test_get_me_success(client):
    """Test getting current user info with valid token"""
    # Register user
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "me@example.com",
            "password": "password123"
        }
    )

    token = register_response.json()["access_token"]

    # Get current user
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["email"] == "me@example.com"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data  # Password should not be returned


def test_get_me_no_token(client):
    """Test getting current user without token"""
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 403  # Forbidden (no auth header)


def test_get_me_invalid_token(client):
    """Test getting current user with invalid token"""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )

    assert response.status_code == 401  # Unauthorized
