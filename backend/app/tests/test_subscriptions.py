"""
Tests for subscription endpoints
"""
import pytest
from fastapi.testclient import TestClient


# Helper function to create a user and get token
def create_test_user(client, email="test@example.com", password="password123"):
    """Helper to create a user and return auth token"""
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password}
    )
    return response.json()["access_token"]


def test_create_subscription_success(client):
    """Test creating a subscription"""
    token = create_test_user(client)

    response = client.post(
        "/api/v1/subscriptions",
        json={
            "name": "Netflix",
            "cost": 15.99,
            "billing_cycle": "monthly",
            "value_score": 5,
            "category": "Entertainment"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    data = response.json()

    assert data["name"] == "Netflix"
    assert float(data["cost"]) == 15.99
    assert data["billing_cycle"] == "monthly"
    assert data["value_score"] == 5
    assert data["category"] == "Entertainment"
    assert data["status"] == "active"
    assert "id" in data
    assert "user_id" in data


def test_create_subscription_no_auth(client):
    """Test creating subscription without authentication"""
    response = client.post(
        "/api/v1/subscriptions",
        json={
            "name": "Netflix",
            "cost": 15.99,
            "billing_cycle": "monthly",
            "value_score": 5
        }
    )

    assert response.status_code == 403  # Forbidden


def test_create_subscription_invalid_cost(client):
    """Test creating subscription with invalid cost"""
    token = create_test_user(client)

    response = client.post(
        "/api/v1/subscriptions",
        json={
            "name": "Netflix",
            "cost": -5.00,  # Negative cost
            "billing_cycle": "monthly",
            "value_score": 5
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 422  # Validation error


def test_create_subscription_invalid_value_score(client):
    """Test creating subscription with invalid value score"""
    token = create_test_user(client)

    response = client.post(
        "/api/v1/subscriptions",
        json={
            "name": "Netflix",
            "cost": 15.99,
            "billing_cycle": "monthly",
            "value_score": 10  # Out of range (1-5)
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 422  # Validation error


def test_list_subscriptions_empty(client):
    """Test listing subscriptions when none exist"""
    token = create_test_user(client)

    response = client.get(
        "/api/v1/subscriptions",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json() == []


def test_list_subscriptions(client):
    """Test listing subscriptions"""
    token = create_test_user(client)

    # Create two subscriptions
    client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token}"}
    )
    client.post(
        "/api/v1/subscriptions",
        json={"name": "Spotify", "cost": 9.99, "billing_cycle": "monthly", "value_score": 4},
        headers={"Authorization": f"Bearer {token}"}
    )

    response = client.get(
        "/api/v1/subscriptions",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["name"] in ["Netflix", "Spotify"]


def test_list_subscriptions_filter_by_status(client):
    """Test filtering subscriptions by status"""
    token = create_test_user(client)

    # Create and cancel one subscription
    response = client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token}"}
    )
    sub_id = response.json()["id"]

    client.patch(
        f"/api/v1/subscriptions/{sub_id}/cancel",
        headers={"Authorization": f"Bearer {token}"}
    )

    # Create another active subscription
    client.post(
        "/api/v1/subscriptions",
        json={"name": "Spotify", "cost": 9.99, "billing_cycle": "monthly", "value_score": 4},
        headers={"Authorization": f"Bearer {token}"}
    )

    # Get only active subscriptions
    response = client.get(
        "/api/v1/subscriptions?status=active",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Spotify"


def test_get_subscription_success(client):
    """Test getting a specific subscription"""
    token = create_test_user(client)

    # Create subscription
    create_response = client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token}"}
    )
    sub_id = create_response.json()["id"]

    # Get subscription
    response = client.get(
        f"/api/v1/subscriptions/{sub_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sub_id
    assert data["name"] == "Netflix"


def test_get_subscription_not_found(client):
    """Test getting non-existent subscription"""
    token = create_test_user(client)

    response = client.get(
        "/api/v1/subscriptions/00000000-0000-0000-0000-000000000000",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404


def test_update_subscription_success(client):
    """Test updating a subscription"""
    token = create_test_user(client)

    # Create subscription
    create_response = client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token}"}
    )
    sub_id = create_response.json()["id"]

    # Update subscription
    response = client.put(
        f"/api/v1/subscriptions/{sub_id}",
        json={"name": "Netflix Premium", "cost": 19.99, "value_score": 4},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Netflix Premium"
    assert float(data["cost"]) == 19.99
    assert data["value_score"] == 4


def test_cancel_subscription_success(client):
    """Test cancelling a subscription"""
    token = create_test_user(client)

    # Create subscription
    create_response = client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token}"}
    )
    sub_id = create_response.json()["id"]

    # Cancel subscription
    response = client.patch(
        f"/api/v1/subscriptions/{sub_id}/cancel",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "cancelled"


def test_user_isolation(client):
    """Test that users can only access their own subscriptions"""
    # Create two users
    token1 = create_test_user(client, "user1@example.com")
    token2 = create_test_user(client, "user2@example.com")

    # User 1 creates a subscription
    response = client.post(
        "/api/v1/subscriptions",
        json={"name": "Netflix", "cost": 15.99, "billing_cycle": "monthly", "value_score": 5},
        headers={"Authorization": f"Bearer {token1}"}
    )
    sub_id = response.json()["id"]

    # User 2 tries to access User 1's subscription
    response = client.get(
        f"/api/v1/subscriptions/{sub_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )

    assert response.status_code == 404  # Not found (for security)
