import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Redirect theo role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/patient/appointments', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '60px 20px', minHeight: 'calc(100vh - 200px)' }}>
      <div className="wrap" style={{ maxWidth: '460px' }}>
        <div className="form-card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2>Đăng nhập tài khoản</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '6px' }}>
              Truy cập hệ thống đặt khám Group 9
            </p>
          </div>

          {/* Quick Demo Accounts Buttons */}
          <div className="quick-demo-accounts">
            <div className="quick-demo-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Chọn nhanh tài khoản Demo:
            </div>
            <div className="quick-demo-buttons">
              <button
                type="button"
                className="btn-demo"
                onClick={() => handleQuickFill('admin@clinic.com', 'Admin@123')}
              >
                🔑 Admin
              </button>
              <button
                type="button"
                className="btn-demo"
                onClick={() => handleQuickFill('doctor.an@clinic.com', 'Doctor@123')}
              >
                🩺 Bác sĩ An
              </button>
              <button
                type="button"
                className="btn-demo"
                onClick={() => handleQuickFill('patient.hung@gmail.com', 'Patient@123')}
              >
                👤 Bệnh nhân Hùng
              </button>
            </div>
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--muted)' }}>
            Chưa có tài khoản Bệnh nhân?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Đăng ký tại đây
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
