"""add_emoji_to_subscriptions

Revision ID: c1272a4170ad
Revises: 02_create_subscriptions
Create Date: 2025-11-08 00:21:51.210314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1272a4170ad'
down_revision: Union[str, None] = '02_create_subscriptions'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add emoji column to subscriptions table
    op.add_column('subscriptions', sa.Column('emoji', sa.String(length=10), nullable=True))


def downgrade() -> None:
    # Remove emoji column from subscriptions table
    op.drop_column('subscriptions', 'emoji')
