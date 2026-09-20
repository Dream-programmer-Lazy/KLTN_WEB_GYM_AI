import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';

export default function UserRegister() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Đăng ký tài khoản hội viên thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#fdf8f6', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* CỘT TRÁI */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#fff', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', textDecoration: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <ArrowLeft size={16} /> Quay lại Trang Chủ
          </Link>
        </div>

        <div style={{ maxWidth: '480px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px' }}>
            <Sparkles size={14} /> CỔNG ĐĂNG KÝ HỘI VIÊN
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: '#fff' }}>
            Trở Thành Hội Viên <br /><span style={{ color: '#6ee7b7' }}>KOI Fitness & Wellness</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#d1fae5', lineHeight: '1.6', margin: 0 }}>
            Đăng ký tài khoản hội viên để theo dõi lịch sử tập luyện, số đo thể hình và báo cáo sức khỏe cá nhân hóa từ AI.
          </p>
        </div>

        <div style={{ fontSize: '13px', color: '#a7f3d0' }}>
          Hệ thống quản lý hội viên thông minh • Dành cho khách hàng
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div style={{ width: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#fff', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Đăng Ký Hội Viên</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Tạo tài khoản cá nhân của bạn</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>TÊN ĐĂNG NHẬP</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Nhập tên hội viên..."
                  value={formData.username}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>ĐỊA CHỈ EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="hoivien@gmail.com"
                  value={formData.email}
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
                marginTop: '10px',
                width: '100%',
                padding: '13px',
                backgroundColor: '#047857',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(4,120,87,0.25)'
              }}
            >
              {loading ? 'Đang Xử Lý...' : 'ĐĂNG KÝ HỘI VIÊN'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#047857', fontWeight: '700', textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}