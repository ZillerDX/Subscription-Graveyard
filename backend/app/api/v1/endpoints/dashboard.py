"""
Dashboard Endpoints
API endpoints for dashboard statistics and analytics
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.dashboard_service import DashboardService


router = APIRouter()


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get dashboard statistics

    Returns:
        - monthly_burn: Total monthly cost (normalized)
        - yearly_cost: Total yearly cost
        - active_count: Number of active subscriptions
        - total_count: Total number of subscriptions
    """
    stats = DashboardService.calculate_stats(str(current_user.id), db)
    return stats


@router.get("/kill-zone", status_code=status.HTTP_200_OK)
async def get_kill_zone_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get data for Kill Zone scatter plot

    Returns list of active subscriptions with:
        - id: Subscription ID
        - name: Subscription name
        - cost: Monthly cost (normalized)
        - value_score: Value score (1-5)
        - category: Category name
        - billing_cycle: Billing cycle type
    """
    kill_zone_data = DashboardService.get_kill_zone_data(str(current_user.id), db)
    return kill_zone_data


@router.get("/category-breakdown", status_code=status.HTTP_200_OK)
async def get_category_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get spending breakdown by category

    Returns list sorted by monthly cost (descending) with:
        - category: Category name (or "Uncategorized")
        - monthly_cost: Total monthly cost for category
        - count: Number of subscriptions in category
    """
    breakdown = DashboardService.get_category_breakdown(str(current_user.id), db)
    return breakdown
