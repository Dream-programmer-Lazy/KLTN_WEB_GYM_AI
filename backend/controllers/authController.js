const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã được sử dụng!' });
        }

        const newUser = new User({
            username,
            email,
            password,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        // In lỗi chi tiết ra màn hình terminal của Node.js để dễ debug
        console.error('❌ Chi tiết lỗi đăng ký tại server:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký: ' + error.message, error });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
        }

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: 'mock-jwt-token-' + user._id,
            role: user.role || 'user',
            username: user.username
        });
    } catch (error) {
        console.error('❌ Chi tiết lỗi đăng nhập tại server:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập', error });
    }
};