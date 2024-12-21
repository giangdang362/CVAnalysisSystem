"""Update models

Revision ID: 3ebacb8f889e
Revises: 
Create Date: 2024-12-21 02:28:23.986551

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3ebacb8f889e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('cv', 'name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('cv', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('cv', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.create_index(op.f('ix_cv_expect_salary'), 'cv', ['expect_salary'], unique=False)
    op.create_index(op.f('ix_cv_id'), 'cv', ['id'], unique=False)
    op.create_index(op.f('ix_cv_role'), 'cv', ['role'], unique=False)
    op.alter_column('jd', 'name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('jd', 'company_name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('jd', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('jd', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.create_index(op.f('ix_jd_id'), 'jd', ['id'], unique=False)
    op.create_index(op.f('ix_jd_languages'), 'jd', ['languages'], unique=False)
    op.create_index(op.f('ix_jd_level'), 'jd', ['level'], unique=False)
    op.create_index(op.f('ix_jd_role'), 'jd', ['role'], unique=False)
    op.create_index(op.f('ix_jd_technical_skill'), 'jd', ['technical_skill'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_jd_technical_skill'), table_name='jd')
    op.drop_index(op.f('ix_jd_role'), table_name='jd')
    op.drop_index(op.f('ix_jd_level'), table_name='jd')
    op.drop_index(op.f('ix_jd_languages'), table_name='jd')
    op.drop_index(op.f('ix_jd_id'), table_name='jd')
    op.alter_column('jd', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('jd', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('jd', 'company_name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('jd', 'name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_index(op.f('ix_cv_role'), table_name='cv')
    op.drop_index(op.f('ix_cv_id'), table_name='cv')
    op.drop_index(op.f('ix_cv_expect_salary'), table_name='cv')
    op.alter_column('cv', 'updated_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('cv', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('cv', 'name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###
