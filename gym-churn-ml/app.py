import math
import os
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "gym_churn_model.joblib"


FEATURES = [
    "gender",
    "Near_Location",
    "Partner",
    "Promo_friends",
    "Phone",
    "Contract_period",
    "Group_visits",
    "Age",
    "Avg_additional_charges_total",
    "Month_to_end_contract",
    "Lifetime",
    "Avg_class_frequency_total",
    "Avg_class_frequency_current_month",
]

BINARY_FEATURES = ["gender", "Near_Location", "Partner", "Promo_friends", "Phone", "Group_visits"]

app = Flask(__name__)
CORS(app)
app.json.ensure_ascii = False


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Không tìm thấy '{MODEL_PATH.name}'. Hãy chạy `python train.py` trước để tạo file model."
        )
    return joblib.load(MODEL_PATH)


model = load_model()


def get_risk_level(probability_pct: float) -> str:
    """Phân mức rủi ro theo xác suất rời bỏ (đơn vị %)."""
    if probability_pct < 30:
        return "Thấp"
    if probability_pct <= 70:
        return "Trung bình"
    return "Cao"


def validate_payload(data):
    """Kiểm tra dữ liệu đầu vào. Trả về (values, None) nếu hợp lệ, ngược lại (None, errors)."""
    if not isinstance(data, dict):
        return None, {"body": "phải là một JSON object chứa 13 thuộc tính"}

    values, errors = {}, {}
    for name in FEATURES:
        raw = data.get(name)
        if raw is None:
            errors[name] = "thiếu (bắt buộc)"
            continue
        try:
            value = float(raw)
        except (TypeError, ValueError):
            errors[name] = "phải là số"
            continue
        if not math.isfinite(value) or value < 0:
            errors[name] = "phải là số không âm"
            continue
        if name in BINARY_FEATURES and value not in (0.0, 1.0):
            errors[name] = "chỉ nhận 0 hoặc 1"
            continue
        values[name] = value

    return (values, None) if not errors else (None, errors)


@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify(error="Body phải là JSON hợp lệ (Content-Type: application/json)"), 400

    values, errors = validate_payload(data)
    if errors:
        return jsonify(error="Dữ liệu đầu vào không hợp lệ", details=errors), 400

    try:
        X = pd.DataFrame([values], columns=FEATURES)
        prediction = int(model.predict(X)[0])
        probability = round(float(model.predict_proba(X)[0][1]) * 100, 2)
    except Exception:  # noqa: BLE001
        app.logger.exception("Lỗi khi dự đoán")
        return jsonify(error="Lỗi khi chạy mô hình"), 500

    return jsonify(
        churn_prediction=prediction,
        churn_probability=probability,
        risk_level=get_risk_level(probability),
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
