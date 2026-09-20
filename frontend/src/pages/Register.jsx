import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'admin' });
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
      alert('Đăng ký tài khoản Quản trị thành công! Vui lòng đăng nhập.');
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
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)', color: '#fff', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fef3c7', textDecoration: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <ArrowLeft size={16} /> Quay lại Trang Chủ
          </Link>
        </div>
        <div style={{ maxWidth: '480px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#fde68a20', color: '#fef3c7', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px', border: '1px solid #fde68a40' }}>
            <Sparkles size={14} /> CỔNG QUẢN TRỊ VIÊN (ADMIN)
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: '#fff' }}>
            Đăng Ký Tài Khoản <br /><span style={{ color: '#f59e0b' }}>Quản Trị Hệ Thống</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#fde68a', lineHeight: '1.6' }}>
            Quản lý toàn bộ hồ sơ hội viên, chạy mô hình AI hàng loạt và kiểm soát dữ liệu toàn phòng tập.
          </p>
        </div>
        <div style={{ fontSize: '13px', color: '#d97706' }}>Phân hệ Quản trị cấp cao</div>
      </div>

      <div style={{ width: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#fff', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Đăng Ký Admin</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Thiết lập tài khoản quản lý hệ thống</p>

          {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>TÊN ĐĂNG NHẬP ADMIN</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input type="text" name="username" required placeholder="admin..." value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input type="email" name="email" required placeholder="admin@gym.vn" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', backgroundColor: '#78350f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}>
              {loading ? 'Đang Xử Lý...' : 'ĐĂNG KÝ QUẢN TRỊ'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Đã có tài khoản? <Link to="/login" style={{ color: '#b45309', fontWeight: '700', textDecoration: 'none' }}>Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}