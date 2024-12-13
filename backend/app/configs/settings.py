# Đọc API key từ env

import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()


# Đọc API key từ biến môi trường
API_KEY = os.getenv("API_KEY")

DATABASE_URL = os.getenv("DATABASE_URL")