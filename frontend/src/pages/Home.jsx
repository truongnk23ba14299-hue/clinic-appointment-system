import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=80',
    title: 'Phòng khám hiện đại & Bác sĩ tận tâm'
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=80',
    title: 'Chăm sóc sức khỏe toàn diện'
  },
  {
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1800&q=80',
    title: 'Trang thiết bị y tế tiên tiến'
  },
  {
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1800&q=80',
    title: 'Đội ngũ y bác sĩ giàu chuyên môn'
  }
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specRes, docRes] = await Promise.all([
          api.getSpecialties(),
          api.getDoctors()
        ]);
        if (specRes.success) setSpecialties(specRes.specialties);
        if (docRes.success) setDoctors(docRes.doctors);
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero-photo">
        <div className="hero-bg-slider">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-indicators">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-indicator-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="wrap">
          <div className="hero-photo-content">
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              MỞ CỬA 24/7 · TIẾP NHẬN ĐẶT LỊCH TRỰC TUYẾN
            </div>
            <h1>
              Chào mừng đến với <span className="highlight">Phòng khám Group 9</span>
            </h1>
            <p>
              Đặt lịch khám trực tuyến, lựa chọn bác sĩ chuyên khoa phù hợp và quản lý lịch hẹn
              thuận tiện, không còn cảnh chờ đợi tại phòng khám.
            </p>
            <div className="hero-actions">
              <Link to="/patient/appointments/book" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Đặt lịch hẹn ngay
              </Link>
              <Link to="/doctors" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Tìm bác sĩ
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="num">50+</div>
                <div className="lbl">Bác sĩ chuyên khoa</div>
              </div>
              <div className="stat-item">
                <div className="num">24/7</div>
                <div className="lbl">Tiếp nhận đặt lịch</div>
              </div>
              <div className="stat-item">
                <div className="num">99%</div>
                <div className="lbl">Hài lòng dịch vụ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHUYÊN KHOA NỔI BẬT */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Chuyên khoa nổi bật</h2>
              <p>Chọn chuyên khoa để tìm kiếm bác sĩ phù hợp với nhu cầu khám bệnh</p>
            </div>
            <Link to="/specialties" className="btn btn-outline btn-sm">
              Xem tất cả chuyên khoa →
            </Link>
          </div>

          <div className="pill-row">
            {specialties.slice(0, 6).map((spec) => (
              <Link
                key={spec.id}
                to={`/doctors?specialty_id=${spec.id}`}
                className="pill"
                style={{ textDecoration: 'none' }}
              >
                {spec.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ĐỘI NGŨ BÁC SĨ */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Đội ngũ bác sĩ tiêu biểu</h2>
              <p>Các chuyên gia giàu kinh nghiệm sẵn sàng thăm khám và tư vấn</p>
            </div>
            <Link to="/doctors" className="btn btn-outline btn-sm">
              Xem tất cả bác sĩ →
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải danh sách bác sĩ...</p>
          ) : (
            <div className="doctor-grid">
              {doctors.slice(0, 6).map((doc) => (
                <div key={doc.id} className="doctor-card">
                  <div className="doctor-card-header">
                    <div
                      className="avatar-circle"
                      style={{
                        background: '#0D9488',
                        color: '#FFF',
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '18px'
                      }}
                    >
                      {doc.name ? doc.name.slice(0, 2).toUpperCase() : 'BS'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '17px' }}>
                        <Link to={`/doctors/${doc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {doc.name}
                        </Link>
                      </h3>
                      <span className="spec-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                        {doc.specialty_name}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '12px 0', flex: 1 }}>
                    {doc.description || 'Bác sĩ chuyên khoa giàu kinh nghiệm điều trị và chăm sóc sức khỏe.'}
                  </p>
                  <div style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '12px' }}>
                    <strong>Kinh nghiệm:</strong> {doc.experience_years} năm công tác
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/doctors/${doc.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Xem hồ sơ
                    </Link>
                    <Link
                      to={`/patient/appointments/book?doctor_id=${doc.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Đặt khám
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
