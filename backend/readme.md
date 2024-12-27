
## Trên Local

### Active môi trường

python -m venv venv
venv/Scripts/activate

### Cài đặt tất cả các thư viện bằng lệnh:

cd backend/
pip install -r requirements.txt

### Tắt môi trường

deactivate

### Run

uvicorn app.main:app --reload


## Trên AWS

#### SSH vào server

ssh -i "path/to/key.pem" ubuntu@23.22.210.48

#### Truy cập root folder

sudo -i

cd app

cd CVAnalysisSystem/

#### List pm2

pm2 ls

*** FE - ID: 0 || BE - ID: 1

#### Activate venv:

source venv/bin/activate

### Cài đặt tất cả các thư viện bằng lệnh:

cd backend/
pip install -r requirements.txt

#### Restart pm2: 

pm2 restart 0

pm2 restart 15


#### Kiểm tra trạng thái pm2:

pm2 log 0

pm2 log 15

