import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DoctorAvatar } from '../components/DoctorAvatar';

const HERO_SLIDES = [
  {
    id: 1,
    name: 'BS. CKII Nguyễn Văn An',
    specialty: 'Khoa Nội khoa',
    title: 'Trưởng khoa Nội tổng quát',
    experience: '12 năm kinh nghiệm',
    desc: 'Chuyên gia đầu ngành về điều trị các bệnh mãn tính, tầm soát sức khỏe toàn diện và tư vấn phác đồ điều trị cá nhân hóa.',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1800&q=80'
  },
  {
    id: 2,
    name: 'ThS.BS Đặng Thị Mai',
    specialty: 'Khoa Nhi khoa',
    title: 'Bác sĩ Chuyên khoa Nhi',
    experience: '7 năm kinh nghiệm',
    desc: 'Tận tâm, thấu hiểu tâm lý trẻ nhỏ, chuyên sâu về chăm sóc sơ sinh, dinh dưỡng và đồng hành cùng sự phát triển của bé.',
    url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=1800&q=80'
  },
  {
    id: 3,
    name: 'ThS.BS Lê Minh Cường',
    specialty: 'Khoa Da liễu',
    title: 'Bác sĩ Chuyên khoa Da liễu',
    experience: '10 năm kinh nghiệm',
    desc: 'Chuyên sâu điều trị mụn trứng cá chuẩn y khoa, phục hồi màng bảo vệ da và ứng dụng công nghệ thẩm mỹ da hiện đại.',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1800&q=80'
  },
  {
    id: 4,
    name: 'PGS.TS Phạm Thu Hà',
    specialty: 'Khoa Tim mạch',
    title: 'Cố vấn Chuyên môn Tim mạch',
    experience: '15 năm kinh nghiệm',
    desc: 'Chuyên gia Tim mạch đầu ngành về tầm soát cao huyết áp, bệnh mạch vành, suy tim và can thiệp điều trị tiên tiến.',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1800&q=80'
  },
  {
    id: 5,
    name: 'BS. CKI Hoàng Văn Đức',
    specialty: 'Khoa Tai Mũi Họng',
    title: 'Bác sĩ Chuyên khoa Tai Mũi Họng',
    experience: '9 năm kinh nghiệm',
    desc: 'Nội soi kỹ thuật cao không đau, điều trị dứt điểm viêm xoang, viêm họng mãn tính, viêm amidan và các bệnh lý thanh quản.',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1800&q=80'
  },
  {
    id: 6,
    name: 'BS. CKI Vũ Thị Lan',
    specialty: 'Khoa Mắt',
    title: 'Bác sĩ Chuyên khoa Nhãn khoa',
    experience: '11 năm kinh nghiệm',
    desc: 'Khám đo khúc xạ chuyên sâu, kiểm soát cận thị học đường, điều trị nhược thị và các bệnh lý giác mạc bảo vệ thị lực.',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1800&q=80'
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

  const currentDoctor = HERO_SLIDES[currentSlide];

  return (
    <main>
      {/* HERO SECTION - BANNER BÁC SĨ TỪNG KHOA */}
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

        {/* Indicators cho 6 chuyên khoa */}
        <div className="hero-indicators">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={idx}
              className={`hero-indicator-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`${slide.specialty}: ${slide.name}`}
              title={`${slide.specialty}: ${slide.name}`}
            />
          ))}
        </div>

        <div className="wrap">
          <div className="hero-photo-content">
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ĐỘI NGŨ BÁC SĨ CHUYÊN KHOA · PHÒNG KHÁM ĐA KHOA GROUP 9
            </div>
            <h1>
              Chào mừng đến với <span className="highlight">Phòng khám Đa khoa Group 9</span>
            </h1>

            {/* Khối thông tin nổi bật của bác sĩ trên slide */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
                marginTop: '16px',
                marginBottom: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {currentDoctor.specialty}
                </span>
                <span style={{ color: '#2DD4BF', fontSize: '13px', fontWeight: '600' }}>
                  {currentDoctor.experience}
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                  · {currentDoctor.title}
                </span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 8px', color: '#fff', letterSpacing: '-0.02em' }}>
                {currentDoctor.name}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: 1.55 }}>
                {currentDoctor.desc}
              </p>
            </div>

            <div className="hero-actions">
              <Link to={`/patient/appointments/book?doctor_id=${currentDoctor.id}`} className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Đặt khám với bác sĩ này
              </Link>
              <Link
                to="/doctors"
                className="btn btn-outline"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.35)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Xem tất cả bác sĩ
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="num">6/6</div>
                <div className="lbl">Khoa có bác sĩ phụ trách</div>
              </div>
              <div className="stat-item">
                <div className="num">24/7</div>
                <div className="lbl">Tiếp nhận đặt lịch</div>
              </div>
              <div className="stat-item">
                <div className="num">100%</div>
                <div className="lbl">Bác sĩ chuyên khoa giàu kinh nghiệm</div>
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
                    <DoctorAvatar src={doc.avatar_url} name={doc.name} size={56} />
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
