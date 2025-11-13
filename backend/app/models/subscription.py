"""
Subscription database model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Enum, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class BillingCycle(str, enum.Enum):
    """Enum for billing cycle"""
    MONTHLY = "monthly"
    YEARLY = "yearly"


class SubscriptionStatus(str, enum.Enum):
    """Enum for subscription status"""
    ACTIVE = "active"
    CANCELLED = "cancelled"


class Subscription(Base):
    """Subscription model"""

    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    cost = Column(Numeric(10, 2), nullable=False)
    billing_cycle = Column(Enum(BillingCycle), nullable=False)
    value_score = Column(Integer, nullable=False)
    category = Column(String(100), nullable=True)
    emoji = Column(String(10), nullable=True)
    status = Column(Enum(SubscriptionStatus), nullable=False, default=SubscriptionStatus.ACTIVE, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="subscriptions")

    def __repr__(self):
        return f"<Subscription(id={self.id}, name={self.name}, cost={self.cost}, status={self.status})>"
