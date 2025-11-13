"""
Dashboard Service
Business logic for dashboard calculations and analytics
"""
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.subscription import Subscription, SubscriptionStatus, BillingCycle
from decimal import Decimal


class DashboardService:
    """Service for dashboard calculations and data aggregation"""

    @staticmethod
    def calculate_stats(user_id: str, db: Session) -> Dict[str, Any]:
        """
        Calculate key statistics for the user's subscriptions

        Args:
            user_id: UUID of the user (as string)
            db: Database session

        Returns:
            Dictionary with monthly_burn, yearly_cost, active_count, total_count
        """
        # Convert string UUID to UUID object
        user_uuid = uuid.UUID(user_id)

        # Get all active subscriptions
        active_subs = (
            db.query(Subscription)
            .filter(
                Subscription.user_id == user_uuid,
                Subscription.status == SubscriptionStatus.ACTIVE
            )
            .all()
        )

        # Calculate monthly burn rate
        monthly_burn = Decimal('0.00')
        for sub in active_subs:
            if sub.billing_cycle == BillingCycle.MONTHLY:
                monthly_burn += sub.cost
            else:  # YEARLY
                monthly_burn += sub.cost / 12

        # Calculate yearly cost
        yearly_cost = monthly_burn * 12

        # Get total subscription count
        total_count = (
            db.query(func.count(Subscription.id))
            .filter(Subscription.user_id == user_uuid)
            .scalar()
        )

        return {
            "monthly_burn": float(monthly_burn),
            "yearly_cost": float(yearly_cost),
            "active_count": len(active_subs),
            "total_count": total_count,
        }

    @staticmethod
    def get_kill_zone_data(user_id: str, db: Session) -> List[Dict[str, Any]]:
        """
        Get data for the Kill Zone scatter plot

        Args:
            user_id: UUID of the user (as string)
            db: Database session

        Returns:
            List of dictionaries with subscription data for scatter plot
        """
        # Convert string UUID to UUID object
        user_uuid = uuid.UUID(user_id)

        # Get all active subscriptions
        active_subs = (
            db.query(Subscription)
            .filter(
                Subscription.user_id == user_uuid,
                Subscription.status == SubscriptionStatus.ACTIVE
            )
            .all()
        )

        kill_zone_data = []
        for sub in active_subs:
            # Normalize to monthly cost for consistent comparison
            monthly_cost = (
                float(sub.cost)
                if sub.billing_cycle == BillingCycle.MONTHLY
                else float(sub.cost / 12)
            )

            kill_zone_data.append({
                "id": str(sub.id),
                "name": sub.name,
                "cost": monthly_cost,
                "value_score": sub.value_score,
                "category": sub.category,
                "billing_cycle": sub.billing_cycle.value,
            })

        return kill_zone_data

    @staticmethod
    def get_category_breakdown(user_id: str, db: Session) -> List[Dict[str, Any]]:
        """
        Get spending breakdown by category

        Args:
            user_id: UUID of the user (as string)
            db: Database session

        Returns:
            List of dictionaries with category, total_cost, count
        """
        # Convert string UUID to UUID object
        user_uuid = uuid.UUID(user_id)

        # Get all active subscriptions
        active_subs = (
            db.query(Subscription)
            .filter(
                Subscription.user_id == user_uuid,
                Subscription.status == SubscriptionStatus.ACTIVE
            )
            .all()
        )

        # Group by category and calculate totals
        category_map: Dict[str, Dict[str, Any]] = {}

        for sub in active_subs:
            category = sub.category or "Uncategorized"

            # Normalize to monthly cost
            monthly_cost = (
                float(sub.cost)
                if sub.billing_cycle == BillingCycle.MONTHLY
                else float(sub.cost / 12)
            )

            if category not in category_map:
                category_map[category] = {
                    "category": category,
                    "monthly_cost": 0.0,
                    "count": 0,
                }

            category_map[category]["monthly_cost"] += monthly_cost
            category_map[category]["count"] += 1

        # Convert to list and sort by cost (descending)
        category_breakdown = sorted(
            category_map.values(),
            key=lambda x: x["monthly_cost"],
            reverse=True
        )

        return category_breakdown
