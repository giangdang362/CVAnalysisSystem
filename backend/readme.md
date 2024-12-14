# Active môi trường
```
python -m env (folder_name)

cd .\backend\
.venv/Scripts/activate
```
# Cài đặt tất cả các thư viện trong project bằng lệnh:

```
pip install -r requirements.txt
```
# Tắt môi trường
```
deactivate
```
# Run backend
```
uvicorn app.main:app --reload
```