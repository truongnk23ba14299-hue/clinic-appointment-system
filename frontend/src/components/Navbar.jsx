import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="brand" title="Phòng khám Đa khoa Group 9">
          <span className="brand-icon">9</span>
          <span className="brand-name">Phòng khám Đa khoa Group 9</span>
        </Link>

        <nav className="main-nav">
          {/* Public & Patient links */}
          {(!isAuthenticated || role === 'PATIENT') && (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Trang chủ
              </NavLink>
              <NavLink to="/doctors" className={({ isActive }) => (isActive ? 'active' : '')}>
                Bác sĩ
              </NavLink>
              <NavLink to="/specialties" className={({ isActive }) => (isActive ? 'active' : '')}>
                Chuyên khoa
              </NavLink>
              {isAuthenticated && role === 'PATIENT' && (
                <>
                  <NavLink to="/patient/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Lịch của tôi
                  </NavLink>
                  <NavLink to="/patient/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Hồ sơ
                  </NavLink>
                </>
              )}
            </>
          )}

          {/* Doctor specific links */}
          {isAuthenticated && role === 'DOCTOR' && (
            <>
              <NavLink to="/doctor/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                Tổng quan
              </NavLink>
              <NavLink to="/doctor/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>
                Lịch làm việc
              </NavLink>
              <NavLink to="/doctor/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                Lịch khám bệnh
              </NavLink>
            </>
          )}

          {/* Admin specific links */}
          {isAuthenticated && role === 'ADMIN' && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                Thống kê
              </NavLink>
              <NavLink to="/admin/doctors" className={({ isActive }) => (isActive ? 'active' : '')}>
                Bác sĩ
              </NavLink>
              <NavLink to="/admin/specialties" className={({ isActive }) => (isActive ? 'active' : '')}>
                Chuyên khoa
              </NavLink>
              <NavLink to="/admin/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                Lịch hẹn
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {(!isAuthenticated || role === 'PATIENT') && (
            <Link to="/patient/appointments/book" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Đặt lịch ngay
            </Link>
          )}

          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Đăng ký
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span className="navbar-user-tag">
                {role === 'ADMIN' ? 'Admin' : role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--ink)',
                  whiteSpace: 'nowrap',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={user?.name}
              >
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}
                title="Đăng xuất khỏi hệ thống"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
