import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Papa from 'papaparse';
import {
  Users, AlertTriangle, UploadCloud,
  PlusCircle, Search, Trash2, LogOut, Dumbbell, ShieldCheck, X, Activity, UserCheck
} from 'lucide-react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Name: '', Age: '', Gender: 'Male', Membership_Type: 'Monthly',
    Avg_Workout_Duration_Min: '', Avg_Calories_Burned: '',
    Total_Weight_Lifted_kg: '', Visits_Per_Month: '', Favorite_Exercise: 'Squats'
  });

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/customers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isMounted) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu quản trị:', error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [navigate]);

  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/customers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({
        Name: '', Age: '', Gender: 'Male', Membership_Type: 'Monthly',
        Avg_Workout_Duration_Min: '', Avg_Calories_Burned: '',
        Total_Weight_Lifted_kg: '', Visits_Per_Month: '', Favorite_Exercise: 'Squats'
      });
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert('Không thể hoàn tất dự báo và lưu hội viên!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa hồ sơ hội viên này khỏi hệ thống?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert('Lỗi xóa hồ sơ!');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const formattedData = results.data.map(row => ({
          Name: row.Name || row.name || 'Hội viên',
          Age: Number(row.Age || row.age) || 25,
          Gender: row.Gender || row.gender || 'Male',
          Membership_Type: row.Membership_Type || row.membership_type || 'Monthly',
          Avg_Workout_Duration_Min: Number(row.Avg_Workout_Duration_Min || row.avg_workout_duration_min) || 60,
          Avg_Calories_Burned: Number(row.Avg_Calories_Burned || row.avg_calories_burned) || 400,
          Total_Weight_Lifted_kg: Number(row.Total_Weight_Lifted_kg || row.total_weight_lifted_kg) || 5000,
          Visits_Per_Month: Number(row.Visits_Per_Month || row.visits_per_month) || 10,
          Favorite_Exercise: row.Favorite_Exercise || row.favorite_exercise || 'Squats'
        }));

        try {
          const token = localStorage.getItem('token');
          const res = await axios.post('http://localhost:5000/api/customers/batch', formattedData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert(`Đã nhập và phân tích AI thành công ${res.data.count || formattedData.length} hội viên!`);
          fetchCustomers();
        } catch (error) {
          console.error(error);
          alert('Lỗi xử lý file CSV!');
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const totalMembers = customers.length;
  const highRiskCount = customers.filter(c => c.churnRisk === 'Cao').length;
  const mediumRiskCount = customers.filter(c => c.churnRisk === 'Trung bình').length;
  const lowRiskCount = customers.filter(c => c.churnRisk === 'Thấp').length;

  const avgChurnRate = totalMembers > 0
    ? (customers.reduce((acc, cur) => acc + (cur.churnProbability || 0), 0) / totalMembers).toFixed(1)
    : 0;

  const retentionRate = totalMembers > 0 ? (100 - avgChurnRate).toFixed(1) : 100;

  const pieChartData = [
    { name: 'Rủi ro Cao', value: highRiskCount, color: '#ef4444' },
    { name: 'Trung bình', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'An toàn (Thấp)', value: lowRiskCount, color: '#10b981' }
  ];

  const membershipAnalysis = useMemo(() => {
    const types = ['Monthly', 'Quarterly', 'Yearly'];
    return types.map(type => {
      const filtered = customers.filter(c => c.Membership_Type === type);
      const avgVisits = filtered.length > 0
        ? (filtered.reduce((acc, cur) => acc + (cur.Visits_Per_Month || 0), 0) / filtered.length).toFixed(1)
        : 0;
      return { type, avgVisits: parseFloat(avgVisits), count: filtered.length };
    });
  }, [customers]);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.Name && c.Name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedTab === 'HIGH') return matchSearch && c.churnRisk === 'Cao';
    if (selectedTab === 'MEDIUM') return matchSearch && c.churnRisk === 'Trung bình';
    if (selectedTab === 'LOW') return matchSearch && c.churnRisk === 'Thấp';
    return matchSearch;
  });

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #334155' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={24} color="#fef3c7" />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px', margin: 0 }}>KOI ADMIN PORTAL</h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Khóa Luận Tốt Nghiệp</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '6px', backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
            <Activity size={18} /> Tổng Quan Điều Hành
          </button>
          <button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '6px', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <PlusCircle size={18} /> Thêm Hồ Sơ Hội Viên
          </button>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '0 8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#78350f', color: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Quản Trị Viên</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>admin@koifitness.vn</span>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            <LogOut size={16} /> Đăng Xuất
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        
        {/* TOPBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
         <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', textAlign: 'left', letterSpacing: 'normal', margin: 0 }}>
              Hệ Thống Quản Trị & Dự Báo Rời Bỏ Hội Viên
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'left', margin: '4px 0 0 0' }}>
              Phân tích dữ liệu hành vi tập luyện thời gian thực bằng Machine Learning (Random Forest)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#334155', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <UploadCloud size={18} color="#78350f" /> Nhập Dataset CSV
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#78350f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', boxShadow: '0 2px 4px rgba(120,53,15,0.2)' }}>
              <PlusCircle size={18} /> Thêm Hội Viên Mới
            </button>
          </div>
        </div>

        {/* EXECUTIVE KPI CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>TỔNG HỘI VIÊN</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#e0f2fe' }}><Users size={20} color="#0284c7" /></div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '12px 0 4px 0' }}>{totalMembers}</h2>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Cơ sở dữ liệu MongoDB</span>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>RỦI RO RỜI BỎ CAO</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fee2e2' }}><AlertTriangle size={20} color="#ef4444" /></div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', margin: '12px 0 4px 0' }}>{highRiskCount}</h2>
            <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Cần can thiệp CSKH ngay</span>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>TỶ LỆ GIỮ CHÂN (RETENTION)</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fef3c7' }}><UserCheck size={20} color="#f59e0b" /></div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '12px 0 4px 0' }}>{retentionRate}%</h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Dựa trên dự báo AI</span>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>ĐỘ CHÍNH XÁC MODEL AI</span>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#d1fae5' }}><ShieldCheck size={20} color="#10b981" /></div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', margin: '12px 0 4px 0' }}>90.0%</h2>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Random Forest Classifier</span>
          </div>

        </div>

        {/* CHARTS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#1e293b' }}>Phân Khúc Rủi Ro Khách Hàng (AI Segments)</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={4}>
                    {pieChartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#1e293b' }}>Tần Suất Tập Luyện Trung Bình Theo Gói</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer>
                <BarChart data={membershipAnalysis}>
                  <XAxis dataKey="type" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="avgVisits" fill="#78350f" radius={[6, 6, 0, 0]} name="Số buổi/tháng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* TABLE SECTION */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'ALL', label: `Tất cả (${totalMembers})` },
                { id: 'HIGH', label: `Nguy cơ cao (${highRiskCount})`, color: '#ef4444' },
                { id: 'MEDIUM', label: `Trung bình (${mediumRiskCount})`, color: '#f59e0b' },
                { id: 'LOW', label: `An toàn (${lowRiskCount})`, color: '#10b981' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: selectedTab === tab.id ? '#0f172a' : '#f1f5f9',
                    color: selectedTab === tab.id ? '#fff' : (tab.color || '#64748b'),
                    transition: '0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                placeholder="Tìm hội viên theo tên..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>

          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '14px 20px' }}>HỘI VIÊN</th>
                <th style={{ padding: '14px 16px' }}>THÔNG TIN</th>
                <th style={{ padding: '14px 16px' }}>GÓI TẬP</th>
                <th style={{ padding: '14px 16px' }}>BUỔI / THÁNG</th>
                <th style={{ padding: '14px 16px' }}>THỜI LƯỢNG TB</th>
                <th style={{ padding: '14px 16px' }}>CALO TIÊU HAO</th>
                <th style={{ padding: '14px 16px' }}>TẠ NĂNG (KG)</th>
                <th style={{ padding: '14px 16px' }}>BÀI TẬP THÍCH</th>
                <th style={{ padding: '14px 16px' }}>XÁC SUẤT CHURN</th>
                <th style={{ padding: '14px 16px' }}>RỦI RO</th>
                <th style={{ padding: '14px 20px', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Đang tải dữ liệu hệ thống...</td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>{c.Name}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{c.Age} tuổi • {c.Gender === 'Male' ? 'Nam' : 'Nữ'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 700 }}>
                        {c.Membership_Type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.Visits_Per_Month} buổi</td>
                    <td style={{ padding: '14px 16px' }}>{c.Avg_Workout_Duration_Min} phút</td>
                    <td style={{ padding: '14px 16px' }}>{c.Avg_Calories_Burned} kcal</td>
                    <td style={{ padding: '14px 16px' }}>{c.Total_Weight_Lifted_kg} kg</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{c.Favorite_Exercise}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.churnProbability}%`, height: '100%', backgroundColor: c.churnRisk === 'Cao' ? '#ef4444' : c.churnRisk === 'Trung bình' ? '#f59e0b' : '#10b981' }}></div>
                        </div>
                        <span style={{ fontWeight: 700 }}>{c.churnProbability}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: c.churnRisk === 'Cao' ? '#fee2e2' : c.churnRisk === 'Trung bình' ? '#fef3c7' : '#d1fae5',
                        color: c.churnRisk === 'Cao' ? '#ef4444' : c.churnRisk === 'Trung bình' ? '#d97706' : '#059669'
                      }}>
                        {c.churnRisk}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(c._id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: '6px' }} title="Xóa hồ sơ">
                        <Trash2 size={16} color="#94a3b8" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Không có hồ sơ nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM HỘI VIÊN */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', width: '650px', borderRadius: '16px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Thêm Hồ Sơ & Dự Báo Rời Bỏ AI</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Phân tích trực tiếp qua mô hình Machine Learning</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} color="#94a3b8" /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>HỌ VÀ TÊN</label>
                <input type="text" required placeholder="Nguyễn Văn A" value={formData.Name} onChange={e => setFormData({ ...formData, Name: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>TUỔI</label>
                <input type="number" required placeholder="25" value={formData.Age} onChange={e => setFormData({ ...formData, Age: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>GIỚI TÍNH</label>
                <select value={formData.Gender} onChange={e => setFormData({ ...formData, Gender: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="Male">Nam (Male)</option>
                  <option value="Female">Nữ (Female)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>LOẠI GÓI TẬP</label>
                <select value={formData.Membership_Type} onChange={e => setFormData({ ...formData, Membership_Type: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="Monthly">Hàng tháng (Monthly)</option>
                  <option value="Quarterly">Hàng quý (Quarterly)</option>
                  <option value="Yearly">Hàng năm (Yearly)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>SỐ BUỔI TẬP / THÁNG</label>
                <input type="number" required placeholder="12" value={formData.Visits_Per_Month} onChange={e => setFormData({ ...formData, Visits_Per_Month: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>THỜI GIAN TẬP TB (PHÚT)</label>
                <input type="number" required placeholder="60" value={formData.Avg_Workout_Duration_Min} onChange={e => setFormData({ ...formData, Avg_Workout_Duration_Min: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>CALO TIÊU HAO TB</label>
                <input type="number" required placeholder="450" value={formData.Avg_Calories_Burned} onChange={e => setFormData({ ...formData, Avg_Calories_Burned: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>TỔNG TẠ NĂNG (KG/THÁNG)</label>
                <input type="number" required placeholder="5000" value={formData.Total_Weight_Lifted_kg} onChange={e => setFormData({ ...formData, Total_Weight_Lifted_kg: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>BÀI TẬP ƯA THÍCH</label>
                <select value={formData.Favorite_Exercise} onChange={e => setFormData({ ...formData, Favorite_Exercise: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="Squats">Squats</option>
                  <option value="Bench Press">Bench Press</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Pull-ups">Pull-ups</option>
                  <option value="Treadmill">Treadmill</option>
                  <option value="Cycling">Cycling</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#78350f', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Phân Tích AI & Lưu Hồ Sơ</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}