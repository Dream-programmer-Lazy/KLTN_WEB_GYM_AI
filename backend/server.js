const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Middlewares (Cấu hình limit lên 50mb để xử lý file CSV lớn)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import và khai báo các Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes); 

// Kết nối với MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối thành công với MongoDB!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Route mặc định kiểm tra server
app.get('/', (req, res) => {
    res.send('Chào mừng đến với Backend Hệ thống Gym Churn Prediction!');
});

// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy tại cổng: ${PORT}`);
});