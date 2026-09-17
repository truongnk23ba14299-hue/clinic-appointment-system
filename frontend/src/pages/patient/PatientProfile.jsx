import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

export const PatientProfile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date_of_birth: '',
    gender: 'Nam',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          const u = res.user;
          const p = u.patient_profile || {};
          setFormData({
            name: u.name || '',
            email: u.email || '',
            phone: p.phone || '',
            date_of_birth: p.date_of_birth || '',
            gender: p.gender || 'Nam',
            address: p.address || ''
          });
        }
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMsg({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Không thể cập nhật hồ sơ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap" style={{ maxWidth: '600px' }}>
        <div className="section-head">
          <div>
            <h2>Hồ sơ cá nhân bệnh nhân</h2>
            <p>Thông tin được sử dụng cho việc đặt lịch và liên hệ từ phòng khám</p>
          </div>
        </div>

        <div className="form-card" style={{ padding: '32px' }}>
          {msg.text && (
            <div
              style={{
                background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${msg.type === 'success' ? '#6EE7B7' : '#FCA5A5'}`,
                color: msg.type === 'success' ? '#065F46' : '#DC2626',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email tài khoản</label>
              <input
                type="email"
                id="email"
                disabled
                value={formData.email}
                style={{ background: '#F1F5F9', cursor: 'not-allowed' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                Email đăng nhập không thể thay đổi
              </div>
            </div>

            <div className="field">
              <label htmlFor="phone">Số điện thoại liên hệ</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ví dụ: 0336578262"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label htmlFor="date_of_birth">Ngày sinh</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="gender">Giới tính</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="address">Địa chỉ thường trú</label>
              <textarea
                id="address"
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, đường, quận/huyện..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
