"""lead fit_score and acquisition source

Revision ID: 20260503_0002
Revises: 20250502_0001
Create Date: 2026-05-03

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260503_0002"
down_revision: Union[str, None] = "20250502_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("leads", sa.Column("fit_score", sa.Integer(), nullable=True))
    op.add_column("leads", sa.Column("acquisition_source", sa.String(length=128), nullable=True))
    op.create_index("ix_leads_fit_score", "leads", ["fit_score"])


def downgrade() -> None:
    op.drop_index("ix_leads_fit_score", table_name="leads")
    op.drop_column("leads", "acquisition_source")
    op.drop_column("leads", "fit_score")
