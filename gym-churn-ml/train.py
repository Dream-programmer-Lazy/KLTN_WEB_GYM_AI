import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

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
TARGET = "Churn"

TEST_SIZE = 0.3
RANDOM_STATE = 42


def load_data(csv_path: str) -> pd.DataFrame:
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"Không tìm thấy file dữ liệu: {path}")

    df = pd.read_csv(path)

    missing_cols = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing_cols:
        raise ValueError(f"File CSV thiếu các cột: {missing_cols}")

    df = df[FEATURES + [TARGET]]

    n_null = int(df.isnull().sum().sum())
    if n_null:
        print(f"[CẢNH BÁO] Có {n_null} ô bị thiếu dữ liệu -> loại các dòng chứa giá trị thiếu.")
        df = df.dropna()
    return df


def main() -> None:
    parser = argparse.ArgumentParser(description="Huấn luyện mô hình dự báo churn phòng Gym")
    parser.add_argument(
        "--data",
        default=str(BASE_DIR / "gym_churn_us.csv"),
        help="Đường dẫn file CSV (mặc định: gym_churn_us.csv cùng thư mục)",
    )
    args = parser.parse_args()


    df = load_data(args.data)
    print(f"Đã nạp {len(df)} dòng | Tỷ lệ churn: {df[TARGET].mean():.2%}")

    X = df[FEATURES]
    y = df[TARGET].astype(int)

    # 2. Chia 70% train / 30% test
    #    stratify=y giữ nguyên tỷ lệ churn ở cả 2 tập (bỏ tham số này nếu muốn chia ngẫu nhiên thuần túy)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train: {len(X_train)} dòng | Test: {len(X_test)} dòng")

    # 3. Pipeline: StandardScaler chỉ fit trên tập train -> không bị data leakage
    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            ("model", LogisticRegression(max_iter=1000, random_state=RANDOM_STATE)),
        ]
    )
    pipeline.fit(X_train, y_train)

    # 4. Đánh giá trên tập test
    y_pred = pipeline.predict(X_test)
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()

    print("\n" + "=" * 55)
    print("KẾT QUẢ ĐÁNH GIÁ TRÊN TẬP TEST")
    print("=" * 55)
    print(f"Accuracy : {accuracy_score(y_test, y_pred):.4f}")
    print(f"Precision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall   : {recall_score(y_test, y_pred):.4f}")
    print(f"F1-score : {f1_score(y_test, y_pred):.4f}")

    print("\nConfusion Matrix:")
    print(f"{'':22}{'Dự đoán: 0':>14}{'Dự đoán: 1':>14}")
    print(f"{'Thực tế 0 (ở lại)':22}{tn:>14}{fp:>14}")
    print(f"{'Thực tế 1 (rời bỏ)':22}{fn:>14}{tp:>14}")
    print(f"-> TN={tn} | FP={fp} | FN={fn} | TP={tp}")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Ở lại (0)", "Rời bỏ (1)"], digits=4))

    # 5. Lưu toàn bộ Pipeline (scaler + model) vào 1 file
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Đã lưu Pipeline vào: {MODEL_PATH}")


if __name__ == "__main__":
    main()
