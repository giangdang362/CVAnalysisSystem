# Active môi trường
```
python -m venv venv
venv/Scripts/activate
```
# Cài đặt tất cả các thư viện trong project bằng lệnh:

```
pip install -r requirements.txt
```
# Tắt môi trường
```
deactivate
```
# Run
```
uvicorn app.main:app --reload
```

# Về Claude 3.5 Sonnet:

### Claude 3.5 Sonnet có thể xử lý input là file trực tiếp không?
Claude 3.5 Sonnet (từ Anthropic trên Amazon Bedrock) không hỗ trợ việc đọc trực tiếp các file như .docx hoặc .pdf. Model chỉ nhận input ở dạng text.
Vì vậy, bạn cần chuyển đổi file CV, JD và prompt sang dạng text trước khi truyền vào model.

### Có khả thi không khi xử lý nhiều file và truyền text vào model?

Claude 3.5 Sonnet có giới hạn tối đa khoảng 200k tokens (khoảng 150-200 trang text). Nếu tổng văn bản chuyển đổi từ CV, danh sách JD và prompt vượt quá giới hạn này, model sẽ không thể xử lý được.

Vì vậy:
Giải pháp tối ưu: Chỉ chọn những phần văn bản quan trọng (ví dụ: tóm tắt kinh nghiệm, kỹ năng) từ CV và JD để truyền vào model.
File prompt (nếu quá dài) cũng cần được tóm tắt hoặc cấu trúc lại.
Viết Endpoint xử lý bài toán của bạn: Endpoint mới sẽ thực hiện các bước sau:
Chuyển đổi file CV, danh sách file JD và file prompt .docx sang dạng text.
Tạo input kết hợp: văn bản CV, JD, và tiêu chí chấm điểm từ prompt.
Gửi input đến Claude 3.5 Sonnet để xếp hạng JD theo từng tiêu chí.
Trả về kết quả: danh sách JD và thứ hạng của chúng.