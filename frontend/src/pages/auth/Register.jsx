import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    gender: 'Nam',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/patient/appointments', { replace: true });
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '60px 20px', minHeight: 'calc(100vh - 200px)' }}>
      <div className="wrap" style={{ maxWidth: '520px' }}>
        <div className="form-card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2>Đăng ký tài khoản Bệnh nhân</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '6px' }}>
              Tạo tài khoản để đặt lịch và quản lý hồ sơ khám bệnh trực tuyến
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Họ và tên *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn An"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Địa chỉ Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ten@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mật khẩu *</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ví dụ: 0336578262"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, đường, phường, quận/huyện..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Đang khởi tạo tài khoản...' : 'Hoàn tất đăng ký'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--muted)' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
