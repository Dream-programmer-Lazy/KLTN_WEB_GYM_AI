import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dumbbell, MapPin, Phone, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
export default function LandingPage() {
  const [activeBranch, setActiveBranch] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    Age: '',
    Gender: 'Male',
    Membership_Type: 'Monthly',
    Visits_Per_Month: '12',
    Avg_Workout_Duration_Min: '60',
    Avg_Calories_Burned: '400',
    Total_Weight_Lifted_kg: '5000',
    Favorite_Exercise: 'Squats'
  });

  const branches = [
    { name: "Gym Fitness Sunny Plaza", address: "110A Phạm Văn Đồng, Q. Gò Vấp, TP.HCM", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
    { name: "Gym Fitness D-Homme", address: "765 Hồng Bàng, Q.6, TP.HCM", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80" },
    { name: "Gym Fitness Saigon Pearl", address: "92 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" },
    { name: "Gym Fitness Thủ Đức", address: "307-309 Võ Văn Ngân, TP. Thủ Đức", img: "https://images.unsplash.com/photo-1571902943202-5079261820f4?auto=format&fit=crop&w=800&q=80" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/customers/register', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đăng ký không thành công. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: '"Inter", sans-serif', color: '#1e293b', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={24} color="#fef3c7" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#78350f', letterSpacing: '1px' }}>KOI FITNESS</h2>
            <span style={{ fontSize: '10px', color: '#b45309', fontWeight: '700', letterSpacing: '0.5px' }}>THÂN KHỎE - TRÍ SÁNG - TÂM AN</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
          <a href="#branches" style={{ textDecoration: 'none', color: 'inherit' }}>Hệ Thống Cơ Sở</a>
          <a href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Dịch Vụ & Tiện Ích</a>
          <a href="#register" style={{ textDecoration: 'none', color: 'inherit' }}>Đăng Ký Trải Nghiệm</a>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #78350f', backgroundColor: 'transparent', color: '#78350f', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
            Quản Trị (Admin)
          </button>
          <a href="#register" style={{ padding: '10px 22px', borderRadius: '6px', border: 'none', backgroundColor: '#78350f', color: '#fff', fontWeight: '700', textDecoration: 'none', fontSize: '13px', boxShadow: '0 4px 12px rgba(120,53,15,0.2)' }}>
            ĐĂNG KÝ NGAY
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '80px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#fde68a', color: '#78350f', borderRadius: '20px', fontSize: '12px', fontWeight: '800', marginBottom: '20px' }}>
            <Sparkles size={14} /> HỆ THỐNG PHÒNG TẬP 5 SAO HÀNG ĐẦU VIỆT NAM
          </span>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#451a03', lineHeight: '1.2', margin: '0 0 20px 0' }}>
            Vì Một Việt Nam <br /><span style={{ color: '#b45309' }}>Thân Khỏe - Trí Sáng - Tâm An</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#78350f', lineHeight: '1.6', marginBottom: '32px' }}>
            Trải nghiệm không gian tập luyện đẳng cấp quốc tế tích hợp công nghệ AI phân tích thể trạng và lộ trình tập luyện cá nhân hóa chuyên sâu.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#register" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#78350f', color: '#fff', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>
              Đăng Ký Tập Ngay <ArrowRight size={18} />
            </a>
            <a href="#branches" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#fff', color: '#78350f', border: '1px solid #78350f', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>
              Khám Phá Cơ Sở
            </a>
          </div>
        </div>

        <div style={{ zIndex: 2, display: 'flex', gap: '20px' }}>
          <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=500&q=80" alt="Gym Fitness" style={{ width: '280px', height: '380px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
          <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80" alt="Yoga Pilates" style={{ width: '280px', height: '380px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginTop: '40px' }} />
        </div>
      </section>

      {/* BRANCHES SELECTOR */}
      <section id="branches" style={{ padding: '80px 48px', backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#451a03', margin: '0 0 10px 0' }}>Hệ Thống Cơ Sở KOI Fitness</h2>
          <p style={{ color: '#78350f', fontSize: '15px' }}>Lựa chọn chi nhánh gần bạn nhất để bắt đầu hành trình nâng tầm vóc dáng</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {branches.map((b, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBranch(idx)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: activeBranch === idx ? '#78350f' : '#fef3c7',
                color: activeBranch === idx ? '#fff' : '#78350f',
                transition: '0.2s'
              }}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fffbeb', borderRadius: '16px', overflow: 'hidden', border: '1px solid #fde68a', display: 'flex', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <img src={branches[activeBranch].img} alt="Branch" style={{ width: '50%', objectFit: 'cover' }} />
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#b45309', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Chi nhánh cao cấp</span>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#451a03', margin: '0 0 12px 0' }}>{branches[activeBranch].name}</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78350f', fontSize: '14px', margin: '0 0 24px 0' }}>
              <MapPin size={18} color="#b45309" /> {branches[activeBranch].address}
            </p>
            <ul style={{ paddingLeft: '20px', color: '#78350f', fontSize: '14px', lineHeight: '1.8', margin: '0 0 24px 0' }}>
              <li>Khu vực Gym trang thiết bị nhập khẩu 100% từ Mỹ</li>
              <li>Hồ bơi nước ấm & Phòng xông hơi Onsen Nhật Bản</li>
              <li>Phòng tập Yoga, Pilates với huấn luyện viên quốc tế</li>
            </ul>
            <a href="#register" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#b45309', color: '#fff', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
              Nhận Tư Vấn Cơ Sở Này
            </a>
          </div>
        </div>
      </section>

      {/* REGISTRATION & AI PREDICTION FORM SECTION */}
      <section id="register" style={{ padding: '80px 48px', backgroundColor: '#78350f', color: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', color: '#1e293b', borderRadius: '16px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#451a03', margin: '0 0 8px 0' }}>Đăng Ký Trải Nghiệm & Tư Vấn Tập Luyện</h2>
            <p style={{ fontSize: '14px', color: '#78350f' }}>Điền thông tin của bạn để nhận lịch tập thử và phân tích thể trạng miễn phí từ hệ thống AI</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Đăng Ký Thành Công!</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Hồ sơ của bạn đã được chuyển vào hệ thống quản lý và phân tích AI. Chuyên viên sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
              <button onClick={() => setSubmitted(false)} style={{ padding: '10px 24px', backgroundColor: '#78350f', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                Đăng Ký Hội Viên Khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>HỌ VÀ TÊN</label>
                <input type="text" required placeholder="Ví dụ: Nguyễn Văn A" value={formData.Name} onChange={e => setFormData({ ...formData, Name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>TUỔI</label>
                <input type="number" required placeholder="25" value={formData.Age} onChange={e => setFormData({ ...formData, Age: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>GIỚI TÍNH</label>
                <select value={formData.Gender} onChange={e => setFormData({ ...formData, Gender: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option value="Male">Nam (Male)</option>
                  <option value="Female">Nữ (Female)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>LOẠI GÓI ĐĂNG KÝ</label>
                <select value={formData.Membership_Type} onChange={e => setFormData({ ...formData, Membership_Type: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option value="Monthly">Hàng tháng (Monthly)</option>
                  <option value="Quarterly">Hàng quý (Quarterly)</option>
                  <option value="Yearly">Hàng năm (Yearly)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>SỐ BUỔI TẬP DỰ KIẾN / THÁNG</label>
                <input type="number" required placeholder="12" value={formData.Visits_Per_Month} onChange={e => setFormData({ ...formData, Visits_Per_Month: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>THỜI LƯỢNG TẬP TB (PHÚT)</label>
                <input type="number" required placeholder="60" value={formData.Avg_Workout_Duration_Min} onChange={e => setFormData({ ...formData, Avg_Workout_Duration_Min: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>CALO TIÊU HAO TRUNG BÌNH</label>
                <input type="number" required placeholder="400" value={formData.Avg_Calories_Burned} onChange={e => setFormData({ ...formData, Avg_Calories_Burned: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>TỔNG TẠ NĂNG (KG/THÁNG)</label>
                <input type="number" required placeholder="5000" value={formData.Total_Weight_Lifted_kg} onChange={e => setFormData({ ...formData, Total_Weight_Lifted_kg: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#451a03', display: 'block', marginBottom: '6px' }}>BÀI TẬP YÊU THÍCH</label>
                <select value={formData.Favorite_Exercise} onChange={e => setFormData({ ...formData, Favorite_Exercise: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}>
                  <option value="Squats">Squats</option>
                  <option value="Bench Press">Bench Press</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Pull-ups">Pull-ups</option>
                  <option value="Treadmill">Treadmill</option>
                  <option value="Cycling">Cycling</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#78350f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(120,53,15,0.3)' }}>
                  {loading ? 'Đang Xử Lý & Phân Tích AI...' : 'HOÀN TẤT ĐĂNG KÝ'}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#451a03', color: '#fef3c7', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #78350f' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800' }}>KOI FITNESS & WELLNESS</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#d97706' }}>Hệ thống quản lý phòng tập thông minh tích hợp Machine Learning - Khóa luận tốt nghiệp</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <Phone size={16} color="#d97706" /> Hotline: <strong>0703 602 602</strong>
        </div>
      </footer>

    </div>
  );
}