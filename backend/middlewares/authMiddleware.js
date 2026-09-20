const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Lấy token từ header của request
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Không tìm thấy Token, từ chối truy cập!' });
    }

    try {
        // Cắt bỏ chữ "Bearer " để lấy đúng chuỗi token
        const token = authHeader.replace('Bearer ', '');
        
        // Giải mã token bằng JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin user giải mã được vào request để dùng cho các API sau
        req.user = decoded;
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
};