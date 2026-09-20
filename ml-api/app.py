from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'gym_churn_model.pkl'
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ Đã load thành công mô hình AI chuẩn thực tế!")
else:
    model = None

@app.route('/api/predict_batch', methods=['POST'])
def predict_batch_churn():
    if model is None:
        return jsonify({"error": "Mô hình AI chưa được khởi tạo"}), 500

    try:
        customers = request.get_json()
        input_df = pd.DataFrame(customers)
        
        # Đảm bảo giữ đúng các cột mà model yêu cầu
        expected_columns = [
            'Age', 'Gender', 'Membership_Type', 
            'Avg_Workout_Duration_Min', 'Avg_Calories_Burned', 
            'Total_Weight_Lifted_kg', 'Visits_Per_Month', 'Favorite_Exercise'
        ]
        
        # Bổ sung các cột thiếu bằng giá trị mặc định nếu file CSV thiếu sót
        for col in expected_columns:
            if col not in input_df.columns:
                if col in ['Age', 'Avg_Workout_Duration_Min', 'Avg_Calories_Burned', 'Total_Weight_Lifted_kg', 'Visits_Per_Month']:
                    input_df[col] = 0
                else:
                    input_df[col] = 'Unknown'

        # Ép kiểu dữ liệu số
        numeric_cols = ['Age', 'Avg_Workout_Duration_Min', 'Avg_Calories_Burned', 'Total_Weight_Lifted_kg', 'Visits_Per_Month']
        for col in numeric_cols:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce').fillna(0)

        # Dự báo xác suất
        probabilities = model.predict_proba(input_df)
        
        results = []
        for i, prob in enumerate(probabilities):
            churn_prob = round(prob[1] * 100, 2)
            if churn_prob >= 60:
                risk_level = "Cao"
            elif churn_prob >= 35:
                risk_level = "Trung bình"
            else:
                risk_level = "Thấp"
                
            customer_result = customers[i]
            customer_result['churnProbability'] = churn_prob
            customer_result['churnRisk'] = risk_level
            results.append(customer_result)

        return jsonify(results), 200

    except Exception as e:
        print("Lỗi dự báo hàng loạt:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)