const Customer = require('../models/Customer');
const axios = require('axios');

// Hàm gọi AI API dự báo rủi ro rời bỏ (Churn)
async function fetchAIPrediction(data) {
    try {
        // Địa chỉ API Python Flask (Đảm bảo Python Flask đang chạy đúng cổng này, ví dụ 5001 hoặc 5000)
        const aiResponse = await axios.post('http://localhost:5001/predict', {
            Age: Number(data.Age) || 25,
            Gender: data.Gender || 'Male',
            Membership_Type: data.Membership_Type || 'Monthly',
            Avg_Workout_Duration_Min: Number(data.Avg_Workout_Duration_Min) || 60,
            Avg_Calories_Burned: Number(data.Avg_Calories_Burned) || 400,
            Total_Weight_Lifted_kg: Number(data.Total_Weight_Lifted_kg) || 5000,
            Visits_Per_Month: Number(data.Visits_Per_Month) || 12,
            Favorite_Exercise: data.Favorite_Exercise || 'Squats'
        });
        return {
            churnProbability: aiResponse.data.churnProbability ?? 20.0,
            churnRisk: aiResponse.data.churnRisk ?? 'Thấp'
        };
    } catch (error) {
        console.warn('⚠️ Không kết nối được AI API, sử dụng giá trị mặc định:', error.message);
        // Fallback an toàn nếu AI API gián đoạn
        return { churnProbability: 25.0, churnRisk: 'Trung bình' };
    }
}

// 1. Lấy danh sách hội viên
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Lỗi lấy danh sách hội viên:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// 2. Thêm một hội viên đơn lẻ kèm AI
exports.createCustomer = async (req, res) => {
    try {
        const aiResult = await fetchAIPrediction(req.body);

        const newCustomer = new Customer({
            ...req.body,
            churnProbability: aiResult.churnProbability,
            churnRisk: aiResult.churnRisk
        });

        await newCustomer.save();
        res.status(201).json({ message: 'Thêm hội viên và dự báo AI thành công!', customer: newCustomer });
    } catch (error) {
        console.error('Lỗi thêm hội viên:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm hội viên', error: error.message });
    }
};

// 3. Xử lý nhập hàng loạt từ file CSV (Batch Processing)
exports.createCustomersBatch = async (req, res) => {
    try {
        const rawData = req.body;
        if (!Array.isArray(rawData) || rawData.length === 0) {
            return res.status(400).json({ message: 'Danh sách dữ liệu CSV trống hoặc không hợp lệ!' });
        }

        const processedCustomers = [];

        for (const row of rawData) {
            // Chuẩn hóa và làm sạch dữ liệu từng dòng CSV
            const cleanedData = {
                Name: row.Name || row.name || 'Hội viên CSV',
                Age: Number(row.Age || row.age) || 25,
                Gender: row.Gender || row.gender || 'Male',
                Membership_Type: row.Membership_Type || row.membership_type || 'Monthly',
                Avg_Workout_Duration_Min: Number(row.Avg_Workout_Duration_Min || row.avg_workout_duration_min) || 60,
                Avg_Calories_Burned: Number(row.Avg_Calories_Burned || row.avg_calories_burned) || 400,
                Total_Weight_Lifted_kg: Number(row.Total_Weight_Lifted_kg || row.total_weight_lifted_kg) || 5000,
                Visits_Per_Month: Number(row.Visits_Per_Month || row.visits_per_month) || 12,
                Favorite_Exercise: row.Favorite_Exercise || row.favorite_exercise || 'Squats'
            };

            // Gọi AI dự báo cho từng dòng
            const aiResult = await fetchAIPrediction(cleanedData);

            processedCustomers.push({
                ...cleanedData,
                churnProbability: aiResult.churnProbability,
                churnRisk: aiResult.churnRisk
            });
        }

        // Lưu toàn bộ vào MongoDB
        const inserted = await Customer.insertMany(processedCustomers);
        res.status(201).json({ 
            message: 'Nhập và phân tích AI hàng loạt thành công!', 
            count: inserted.length 
        });
    } catch (error) {
        console.error('❌ Lỗi xử lý Batch CSV tại server:', error);
        res.status(500).json({ message: 'Lỗi xử lý file CSV: ' + error.message, error: error.message });
    }
};

// 4. Xóa hội viên theo ID
exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa hồ sơ hội viên thành công!' });
    } catch (error) {
        console.error('Lỗi xóa hồ sơ:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa', error: error.message });
    }
};