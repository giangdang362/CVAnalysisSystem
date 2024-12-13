# Login Docker Hub

docker login

# Run Docker Compose:
Điều hướng đến thư mục chứa file docker-compose.yml rồi chạy lệnh:

docker-compose up -d


## Extend:

# Khởi động lại Docker:

docker restart

# Kiểm tra trạng thái container

docker ps

# Stop container

docker-compose down

# Tải lại Image PostgreSQL thủ công | Kiểm tra kết nối mạng từ Docker
Nếu Docker Compose không tự động tải được hoặc kiểm tra xem Docker có thể tải image từ Docker Hub không bạn có thể tải image PostgreSQL bằng lệnh:

docker pull postgres

# Reload và restart Docker:

systemctl daemon-reload
systemctl restart docker

# Kiểm tra Logs nếu gặp lỗi về docker

docker logs ai-say-hi

# Xóa Cache

docker system prune -a

# Thêm proxy trong terminal:

export HTTP_PROXY=http://proxy.example.com:port
export HTTPS_PROXY=http://proxy.example.com:port