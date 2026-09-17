import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [docRes, schedRes] = await Promise.all([
          api.getDoctorDetail(id),
          api.getDoctorSchedules(id, { available_only: true })
        ]);

        if (docRes.success) setDoctor(docRes.doctor);
        if (schedRes.success) setSchedules(schedRes.schedules);
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p>Đang tải thông tin chi tiết bác sĩ...</p>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>{error || 'Không tìm thấy bác sĩ yêu cầu'}</h3>
        <Link to="/doctors" className="btn btn-outline" style={{ marginTop: '16px' }}>
          ← Quay lại danh sách bác sĩ
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="section" style={{ paddingTop: '36px' }}>
        <div className="wrap" style={{ maxWidth: '900px' }}>
          <Link to="/doctors" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Trở lại danh sách bác sĩ
          </Link>

          {/* Hero Profile Card */}
          <div className="doctor-profile-hero" style={{ marginTop: '16px' }}>
            <div
              className="avatar-circle"
              style={{
                background: '#0D9488',
                color: '#FFF',
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '28px',
                flexShrink: 0
              }}
            >
              {doctor.name ? doctor.name.slice(0, 2).toUpperCase() : 'BS'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>{doctor.name}</h1>
                <span className="spec-badge">{doctor.specialty_name}</span>
              </div>

              <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--muted)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span>
                  <strong>Kinh nghiệm:</strong> {doctor.experience_years} năm
                </span>
                {doctor.phone && (
                  <span>
                    <strong>Điện thoại:</strong> {doctor.phone}
                  </span>
                )}
                {doctor.email && (
                  <span>
                    <strong>Email:</strong> {doctor.email}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Link
                to={`/patient/appointments/book?doctor_id=${doctor.id}`}
                className="btn btn-primary"
              >
                Đặt lịch hẹn ngay
              </Link>
            </div>
          </div>

          {/* Details Content */}
          <div className="doctor-detail-grid">
            <div className="dept-section">
              <h2>Giới thiệu & Chuyên môn</h2>
              <p style={{ lineHeight: 1.7, color: 'var(--ink)' }}>
                {doctor.description || 'Chưa có thông tin giới thiệu chi tiết.'}
              </p>
            </div>

            {/* Schedules Section */}
            <div className="dept-section">
              <h2>Khung giờ khám khả dụng</h2>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                Chọn một khung giờ trống bên dưới để tiến hành đặt lịch khám nhanh:
              </p>

              {schedules.length === 0 ? (
                <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>
                    Hiện tại bác sĩ chưa có khung giờ khám khả dụng sắp tới. Vui lòng quay lại sau hoặc liên hệ hotline phòng khám.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {schedules.map((sch) => (
                    <div
                      key={sch.id}
                      style={{
                        padding: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                        📅 Ngày: {sch.date}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--primary-dark)', fontWeight: '700' }}>
                        ⏰ {sch.start_time} - {sch.end_time}
                      </div>
                      <Link
                        to={`/patient/appointments/book?doctor_id=${doctor.id}&schedule_id=${sch.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '6px', textAlign: 'center' }}
                      >
                        Chọn giờ này
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
