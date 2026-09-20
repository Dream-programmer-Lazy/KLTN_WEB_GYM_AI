import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib
import os

print("⏳ Đang huấn luyện lại mô hình trên đúng cấu trúc file CSV thực tế...")

dataset_path = 'gym_members_dataset.csv'
if not os.path.exists(dataset_path):
    raise FileNotFoundError("Không tìm thấy file gym_members_dataset.csv trong thư mục ml-api!")

df = pd.read_csv(dataset_path)

# Chuẩn hóa nhãn Churn
df['Churn_target'] = df['Churn'].apply(lambda x: 1 if str(x).strip().lower() == 'yes' else 0)

# Khai báo CHÍNH XÁC các cột có trong dataset thực tế của bạn
features = [
    'Age', 'Gender', 'Membership_Type', 
    'Avg_Workout_Duration_Min', 'Avg_Calories_Burned', 
    'Total_Weight_Lifted_kg', 'Visits_Per_Month', 'Favorite_Exercise'
]

X = df[features]
y = df['Churn_target']

numeric_features = ['Age', 'Avg_Workout_Duration_Min', 'Avg_Calories_Burned', 'Total_Weight_Lifted_kg', 'Visits_Per_Month']
categorical_features = ['Gender', 'Membership_Type', 'Favorite_Exercise']

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model_pipeline.fit(X_train, y_train)

print(f"✅ Huấn luyện thành công! Độ chính xác: {model_pipeline.score(X_test, y_test) * 100:.2f}%")

joblib.dump(model_pipeline, 'gym_churn_model.pkl')
print("✅ Đã ghi đè file gym_churn_model.pkl mới!")