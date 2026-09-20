import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ShieldCheck, LogOut, HeartPulse } from 'lucide-react';

export default function UserDashboard() {
  // Khởi tạo trực tiếp trạng thái để tránh lỗi setState trong useEffect
  const [userInfo] = useState({
    name: 'Nguyễn Văn Hội Viên',
    membership: 'Quarterly (Hội viên Quý)',
    visits: 16,
    duration: 75,
    calories: 520,
    risk: 'Thấp',
    probability: 12.5
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role === 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      <header style={{ backgroundColor: '#fff', padding: '20px 48px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={22} color="#fff" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Cổng Thông Tin Hội Viên KOI Fitness</h2>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
          <LogOut size={16} /> Đăng Xuất
        </button>
      </header>

      <main style={{ padding: '40px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#047857', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              NV
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>Xin chào, {userInfo.name}!</h1>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Gói hội viên hiện tại: <strong style={{ color: '#047857' }}>{userInfo.membership}</strong></p>
            </div>
          </div>
          <div style={{ padding: '12px 20px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} /> Trạng thái: Hội Viên Hoạt Động
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TẦN SUẤT TẬP LUYỆN</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '8px 0 0 0' }}>{userInfo.visits} buổi/tháng</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>THỜI LƯỢNG TRUNG BÌNH</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '8px 0 0 0' }}>{userInfo.duration} phút</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>CALO TIÊU HAO</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '8px 0 0 0' }}>{userInfo.calories} kcal</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>CHỈ SỐ SỨC KHỎE AI</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#10b981', margin: '8px 0 0 0' }}>Ổn định</h2>
          </div>
        </div>

        <div style={{ backgroundColor: '#065f46', color: '#fff', padding: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' }}>🤖 Đánh giá thể trạng từ AI Machine Learning</h3>
            <p style={{ color: '#d1fae5', fontSize: '14px', maxWidth: '700px', margin: 0, lineHeight: '1.6' }}>
              Dựa trên dữ liệu tập luyện của bạn, hệ thống dự báo xác suất duy trì tập luyện đạt mức cao, nguy cơ rời bỏ ở mức <strong style={{ color: '#6ee7b7' }}>{userInfo.risk} ({userInfo.probability}%)</strong>. Hãy tiếp tục duy trì phong độ này nhé!
            </p>
          </div>
          <HeartPulse size={48} color="#6ee7b7" />
        </div>
      </main>
    </div>
  );
}