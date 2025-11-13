"""
Subscription management endpoints
"""
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.subscription import Subscription, SubscriptionStatus
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse

router = APIRouter()


@router.post("", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new subscription for the current user.

    Args:
        subscription_data: Subscription data
        current_user: Current authenticated user
        db: Database session

    Returns:
        SubscriptionResponse: Created subscription
    """
    new_subscription = Subscription(
        user_id=current_user.id,
        name=subscription_data.name,
        cost=subscription_data.cost,
        billing_cycle=subscription_data.billing_cycle,
        value_score=subscription_data.value_score,
        category=subscription_data.category,
        emoji=subscription_data.emoji,
    )

    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)

    return new_subscription


@router.get("", response_model=List[SubscriptionResponse])
async def list_subscriptions(
    status_filter: Optional[SubscriptionStatus] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all subscriptions for the current user.

    Args:
        status_filter: Optional filter by status (active/cancelled)
        category: Optional filter by category
        current_user: Current authenticated user
        db: Database session

    Returns:
        List[SubscriptionResponse]: List of subscriptions
    """
    query = db.query(Subscription).filter(Subscription.user_id == current_user.id)

    # Apply filters
    if status_filter:
        query = query.filter(Subscription.status == status_filter)
    if category:
        query = query.filter(Subscription.category == category)

    subscriptions = query.order_by(Subscription.created_at.desc()).all()

    return subscriptions


@router.get("/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(
    subscription_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific subscription by ID.

    Args:
        subscription_id: Subscription UUID
        current_user: Current authenticated user
        db: Database session

    Returns:
        SubscriptionResponse: Subscription details

    Raises:
        HTTPException: If subscription not found or doesn't belong to user
    """
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )

    return subscription


@router.put("/{subscription_id}", response_model=SubscriptionResponse)
async def update_subscription(
    subscription_id: UUID,
    subscription_data: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a subscription.

    Args:
        subscription_id: Subscription UUID
        subscription_data: Updated subscription data
        current_user: Current authenticated user
        db: Database session

    Returns:
        SubscriptionResponse: Updated subscription

    Raises:
        HTTPException: If subscription not found or doesn't belong to user
    """
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )

    # Update only provided fields
    update_data = subscription_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subscription, field, value)

    db.commit()
    db.refresh(subscription)

    return subscription


@router.patch("/{subscription_id}/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(
    subscription_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a subscription (soft delete - sets status to 'cancelled').

    Args:
        subscription_id: Subscription UUID
        current_user: Current authenticated user
        db: Database session

    Returns:
        SubscriptionResponse: Cancelled subscription

    Raises:
        HTTPException: If subscription not found or doesn't belong to user
    """
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )

    subscription.status = SubscriptionStatus.CANCELLED
    db.commit()
    db.refresh(subscription)

    return subscription


@router.patch("/{subscription_id}/reactivate", response_model=SubscriptionResponse)
async def reactivate_subscription(
    subscription_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Reactivate a cancelled subscription (sets status back to 'active').

    Args:
        subscription_id: Subscription UUID
        current_user: Current authenticated user
        db: Database session

    Returns:
        SubscriptionResponse: Reactivated subscription

    Raises:
        HTTPException: If subscription not found or doesn't belong to user
    """
    # Use db.get() for direct primary key lookup, then verify ownership
    subscription = db.get(Subscription, subscription_id)

    if not subscription or subscription.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )

    subscription.status = SubscriptionStatus.ACTIVE
    db.commit()
    db.refresh(subscription)

    return subscription


@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subscription(
    subscription_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete a subscription (hard delete).
    Use with caution - prefer cancel endpoint for soft delete.

    Args:
        subscription_id: Subscription UUID
        current_user: Current authenticated user
        db: Database session

    Raises:
        HTTPException: If subscription not found or doesn't belong to user
    """
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )

    db.delete(subscription)
    db.commit()

    return None
