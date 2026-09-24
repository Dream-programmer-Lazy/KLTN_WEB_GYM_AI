# Gym churn prediction API

Dịch vụ Flask độc lập sử dụng 13 thuộc tính trong tài liệu yêu cầu. Mô hình `gym_churn_model.joblib` đã nằm trong thư mục này để API khởi động ngay; `train.py` huấn luyện lại từ `gym_churn_us.csv`. Dịch vụ này có schema khác với bản demo `ml-api/`; không đổi endpoint của bản demo khi chưa sửa phần backend gọi API.

## Chạy cục bộ

```bash
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Kiểm tra `GET http://127.0.0.1:5000/health`. Gửi `POST /predict`, header `Content-Type: application/json`, body theo `sample_request.json`. Kết quả gồm `churn_prediction` (0 hoặc 1), `churn_probability` (phần trăm), `risk_level` (Thấp, Trung bình, Cao). Để huấn luyện lại: `python train.py`.

## Git và Render

Nhánh `feature/gym-churn-ml` tạo từ `develop`. Sau khi push, mở pull request với **base `develop`**, compare `feature/gym-churn-ml`. Chỉ merge sau khi nhóm xem diff và kiểm tra API.

Tạo Render Web Service từ repo sau khi merge, chọn branch `develop`, **Root Directory `gym-churn-ml`**, Python runtime, Build Command `pip install -r requirements.txt`, Start Command `gunicorn app:app`, Health Check Path `/health`. Chọn vùng và gói dịch vụ hiện được tài khoản cung cấp. URL của dịch vụ mới nhận POST tại `/predict`.

Backend hiện có route `prediction` làm mẫu và dịch vụ `ml-api` dùng các thuộc tính khác. Khi tích hợp thật, backend cần ánh xạ dữ liệu khách hàng thành đủ 13 trường đúng tên trong `sample_request.json`, gọi URL của dịch vụ này và xử lý các lỗi 400/500. Đừng chỉ đổi URL của endpoint cũ `/api/predict_batch`: payload và kết quả không tương thích.
