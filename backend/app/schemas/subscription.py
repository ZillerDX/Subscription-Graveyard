"""
Pydantic schemas for Subscription model
"""
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field, field_serializer

from app.models.subscription import BillingCycle, SubscriptionStatus


class SubscriptionBase(BaseModel):
    """Base subscription schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Subscription name")
    cost: Decimal = Field(..., gt=0, description="Cost must be greater than 0")
    billing_cycle: BillingCycle
    value_score: int = Field(..., ge=1, le=5, description="Value score from 1 to 5")
    category: Optional[str] = Field(None, max_length=100, description="Optional category")
    emoji: Optional[str] = Field(None, max_length=10, description="Optional emoji icon")


class SubscriptionCreate(SubscriptionBase):
    """Schema for creating a subscription"""
    pass


class SubscriptionUpdate(BaseModel):
    """Schema for updating a subscription (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    cost: Optional[Decimal] = Field(None, gt=0)
    billing_cycle: Optional[BillingCycle] = None
    value_score: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[str] = Field(None, max_length=100)
    emoji: Optional[str] = Field(None, max_length=10)


class SubscriptionResponse(SubscriptionBase):
    """Schema for subscription response"""
    id: UUID
    user_id: UUID
    status: SubscriptionStatus
    created_at: datetime
    updated_at: datetime

    @field_serializer('cost')
    def serialize_cost(self, cost: Decimal, _info):
        """Convert Decimal cost to float for JSON serialization"""
        return float(cost)

    class Config:
        from_attributes = True
