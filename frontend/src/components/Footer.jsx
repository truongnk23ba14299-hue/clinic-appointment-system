import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-icon">9</span> Phòng khám Đa khoa Group 9
          </div>
          <nav className="footer-nav">
            <Link to="/">Trang chủ</Link>
            <Link to="/doctors">Bác sĩ</Link>
            <Link to="/specialties">Chuyên khoa</Link>
            <Link to="/patient/appointments">Lịch của tôi</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Group 9. Hệ thống đặt lịch khám bệnh trực tuyến.</span>
          <span>Hotline Cấp cứu & Tư vấn: <strong>0336 578 262</strong></span>
        </div>
      </div>
    </footer>
  );
};
