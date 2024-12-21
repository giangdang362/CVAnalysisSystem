import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Thêm thư mục gốc (backend) vào sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

# Import Base từ db_connection và toàn bộ models
from app.db.db_connection import Base  # Đảm bảo Base được định nghĩa tại đây
from app.models import *  # Import toàn bộ models để Alembic nhận diện

# Lấy cấu hình từ file alembic.ini
config = context.config

# Cấu hình logging
fileConfig(config.config_file_name)

# Trỏ target_metadata tới Base.metadata
target_metadata = Base.metadata


def run_migrations_offline():
    """Chạy migration trong chế độ 'offline'."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Chạy migration trong chế độ 'online'."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
