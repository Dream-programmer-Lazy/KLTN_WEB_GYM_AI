import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Dumbbell, Lock, User, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);

      // Phân quyền chuyển hướng Dashboard dựa vào role
      if (response.data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#fdf8f6', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)', color: '#fff', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
            <ArrowLeft size={16} /> Quay lại Trang Chủ
          </Link>
        </div>

        <div style={{ zIndex: 2, maxWidth: '480px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#fde68a20', color: '#fef3c7', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', border: '1px solid #fde68a40' }}>
            <Sparkles size={14} /> ENTERPRISE AI PLATFORM
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: '#fff' }}>
            Hệ Thống Phân Tích <br /><span style={{ color: '#f59e0b' }}>Gym Churn Intelligence</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#fde68a', lineHeight: '1.6', margin: 0 }}>
            Nền tảng quản trị và tra cứu thông số thể hình thông minh tích hợp trí tuệ nhân tạo.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#d97706' }}>
          <ShieldCheck size={18} /> Khóa luận tốt nghiệp Đại học • Bảo mật dữ liệu 100%
        </div>
      </div>

      <div style={{ width: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#fff', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Dumbbell size={26} color="#78350f" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Đăng Nhập Hệ Thống</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Truy cập cổng Quản trị hoặc Hội viên</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>TÊN ĐĂNG NHẬP</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Nhập tên tài khoản..."
                  value={formData.username}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '13px',
                backgroundColor: '#78350f',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(120,53,15,0.25)'
              }}
            >
              {loading ? 'Đang Xử Lý...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            <div>Chưa có tài khoản hội viên? <Link to="/user-register" style={{ color: '#047857', fontWeight: '700', textDecoration: 'none' }}>Đăng ký Hội Viên</Link></div>
            <div>Dành cho Quản trị viên? <Link to="/register" style={{ color: '#b45309', fontWeight: '700', textDecoration: 'none' }}>Đăng ký Admin</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}