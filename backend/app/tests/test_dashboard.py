"""
Dashboard Endpoint Tests
Comprehensive tests for dashboard statistics and analytics
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.models.user import User
from app.models.subscription import Subscription, BillingCycle, SubscriptionStatus
from app.core.security import create_access_token


client = TestClient(app)


def create_test_user(db: Session, email: str = "dashboard@test.com") -> User:
    """Helper function to create a test user"""
    user = User(email=email, password_hash="hashed_password")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_test_subscription(
    db: Session,
    user_id: str,
    name: str,
    cost: float,
    billing_cycle: BillingCycle,
    value_score: int,
    category: str = None,
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE
) -> Subscription:
    """Helper function to create a test subscription"""
    subscription = Subscription(
        user_id=user_id,
        name=name,
        cost=cost,
        billing_cycle=billing_cycle,
        value_score=value_score,
        category=category,
        status=status
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


def test_get_stats_empty(db: Session):
    """Test getting stats with no subscriptions"""
    user = create_test_user(db, "stats_empty@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["monthly_burn"] == 0.0
    assert data["yearly_cost"] == 0.0
    assert data["active_count"] == 0
    assert data["total_count"] == 0


def test_get_stats_with_subscriptions(db: Session):
    """Test getting stats with multiple subscriptions"""
    user = create_test_user(db, "stats_with_subs@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create test subscriptions
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5)
    create_test_subscription(db, str(user.id), "Spotify", 9.99, BillingCycle.MONTHLY, 4)
    create_test_subscription(db, str(user.id), "Adobe", 239.88, BillingCycle.YEARLY, 3)  # $19.99/month

    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    # Monthly: 15.99 + 9.99 + (239.88/12) = 45.97
    expected_monthly = 15.99 + 9.99 + (239.88 / 12)
    assert abs(data["monthly_burn"] - expected_monthly) < 0.01

    # Yearly: monthly * 12
    expected_yearly = expected_monthly * 12
    assert abs(data["yearly_cost"] - expected_yearly) < 0.01

    assert data["active_count"] == 3
    assert data["total_count"] == 3


def test_get_stats_with_cancelled_subscriptions(db: Session):
    """Test that cancelled subscriptions are not included in burn calculations"""
    user = create_test_user(db, "stats_cancelled@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create active and cancelled subscriptions
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, status=SubscriptionStatus.ACTIVE)
    create_test_subscription(db, str(user.id), "Hulu", 12.99, BillingCycle.MONTHLY, 3, status=SubscriptionStatus.CANCELLED)
    create_test_subscription(db, str(user.id), "HBO", 14.99, BillingCycle.MONTHLY, 4, status=SubscriptionStatus.CANCELLED)

    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    # Only Netflix should be counted
    assert abs(data["monthly_burn"] - 15.99) < 0.01
    assert data["active_count"] == 1
    assert data["total_count"] == 3  # All subscriptions (including cancelled)


def test_get_stats_requires_auth(db: Session):
    """Test that stats endpoint requires authentication"""
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 403  # Unauthorized


def test_get_kill_zone_data_empty(db: Session):
    """Test getting kill zone data with no subscriptions"""
    user = create_test_user(db, "killzone_empty@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    response = client.get(
        "/api/v1/dashboard/kill-zone",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_get_kill_zone_data_with_subscriptions(db: Session):
    """Test getting kill zone data with multiple subscriptions"""
    user = create_test_user(db, "killzone_with_subs@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create test subscriptions in different quadrants
    sub1 = create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, "Entertainment")
    sub2 = create_test_subscription(db, str(user.id), "Gym", 50.00, BillingCycle.MONTHLY, 2, "Health")
    sub3 = create_test_subscription(db, str(user.id), "Adobe", 239.88, BillingCycle.YEARLY, 4, "Work")

    response = client.get(
        "/api/v1/dashboard/kill-zone",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

    # Verify data structure
    for item in data:
        assert "id" in item
        assert "name" in item
        assert "cost" in item  # Monthly normalized cost
        assert "value_score" in item
        assert "category" in item
        assert "billing_cycle" in item

    # Verify Netflix data
    netflix = next(item for item in data if item["name"] == "Netflix")
    assert netflix["cost"] == 15.99
    assert netflix["value_score"] == 5
    assert netflix["category"] == "Entertainment"

    # Verify Adobe data (yearly normalized to monthly)
    adobe = next(item for item in data if item["name"] == "Adobe")
    assert abs(adobe["cost"] - (239.88 / 12)) < 0.01
    assert adobe["value_score"] == 4


def test_get_kill_zone_data_excludes_cancelled(db: Session):
    """Test that kill zone data excludes cancelled subscriptions"""
    user = create_test_user(db, "killzone_cancelled@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create active and cancelled subscriptions
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, status=SubscriptionStatus.ACTIVE)
    create_test_subscription(db, str(user.id), "Hulu", 12.99, BillingCycle.MONTHLY, 3, status=SubscriptionStatus.CANCELLED)

    response = client.get(
        "/api/v1/dashboard/kill-zone",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Netflix"


def test_get_kill_zone_data_requires_auth(db: Session):
    """Test that kill zone endpoint requires authentication"""
    response = client.get("/api/v1/dashboard/kill-zone")
    assert response.status_code == 403


def test_get_category_breakdown_empty(db: Session):
    """Test getting category breakdown with no subscriptions"""
    user = create_test_user(db, "category_empty@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    response = client.get(
        "/api/v1/dashboard/category-breakdown",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_get_category_breakdown_with_categories(db: Session):
    """Test getting category breakdown with multiple categories"""
    user = create_test_user(db, "category_with_data@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create subscriptions in different categories
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, "Entertainment")
    create_test_subscription(db, str(user.id), "Spotify", 9.99, BillingCycle.MONTHLY, 4, "Entertainment")
    create_test_subscription(db, str(user.id), "Gym", 50.00, BillingCycle.MONTHLY, 3, "Health")
    create_test_subscription(db, str(user.id), "Adobe", 239.88, BillingCycle.YEARLY, 4, "Work")  # $19.99/month

    response = client.get(
        "/api/v1/dashboard/category-breakdown",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

    # Verify data structure
    for item in data:
        assert "category" in item
        assert "monthly_cost" in item
        assert "count" in item

    # Should be sorted by cost descending
    assert data[0]["category"] == "Health"  # $50
    assert data[1]["category"] == "Entertainment"  # $25.98
    assert data[2]["category"] == "Work"  # $19.99

    # Verify Entertainment totals
    entertainment = next(item for item in data if item["category"] == "Entertainment")
    assert abs(entertainment["monthly_cost"] - (15.99 + 9.99)) < 0.01
    assert entertainment["count"] == 2


def test_get_category_breakdown_with_uncategorized(db: Session):
    """Test that subscriptions without category are grouped as 'Uncategorized'"""
    user = create_test_user(db, "category_uncategorized@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create subscriptions with and without categories
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, "Entertainment")
    create_test_subscription(db, str(user.id), "Random Service", 10.00, BillingCycle.MONTHLY, 3, None)
    create_test_subscription(db, str(user.id), "Another Service", 5.00, BillingCycle.MONTHLY, 2, None)

    response = client.get(
        "/api/v1/dashboard/category-breakdown",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    # Verify Uncategorized group exists
    uncategorized = next(item for item in data if item["category"] == "Uncategorized")
    assert abs(uncategorized["monthly_cost"] - 15.00) < 0.01  # 10 + 5
    assert uncategorized["count"] == 2


def test_get_category_breakdown_excludes_cancelled(db: Session):
    """Test that category breakdown excludes cancelled subscriptions"""
    user = create_test_user(db, "category_cancelled@test.com")
    token = create_access_token(data={"sub": str(user.id)})

    # Create active and cancelled subscriptions
    create_test_subscription(db, str(user.id), "Netflix", 15.99, BillingCycle.MONTHLY, 5, "Entertainment", SubscriptionStatus.ACTIVE)
    create_test_subscription(db, str(user.id), "Hulu", 12.99, BillingCycle.MONTHLY, 3, "Entertainment", SubscriptionStatus.CANCELLED)

    response = client.get(
        "/api/v1/dashboard/category-breakdown",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()

    entertainment = next(item for item in data if item["category"] == "Entertainment")
    # Should only count Netflix
    assert abs(entertainment["monthly_cost"] - 15.99) < 0.01
    assert entertainment["count"] == 1


def test_get_category_breakdown_requires_auth(db: Session):
    """Test that category breakdown endpoint requires authentication"""
    response = client.get("/api/v1/dashboard/category-breakdown")
    assert response.status_code == 403


def test_dashboard_user_isolation(db: Session):
    """Test that users can only see their own dashboard data"""
    # Create two users
    user1 = create_test_user(db, "user1@test.com")
    user2 = create_test_user(db, "user2@test.com")

    token1 = create_access_token(data={"sub": str(user1.id)})

    # Create subscriptions for both users
    create_test_subscription(db, str(user1.id), "User1 Sub", 10.00, BillingCycle.MONTHLY, 5, "Test")
    create_test_subscription(db, str(user2.id), "User2 Sub", 20.00, BillingCycle.MONTHLY, 5, "Test")

    # User1 should only see their own data
    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {token1}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["active_count"] == 1
    assert abs(data["monthly_burn"] - 10.00) < 0.01  # Should not include user2's subscription
