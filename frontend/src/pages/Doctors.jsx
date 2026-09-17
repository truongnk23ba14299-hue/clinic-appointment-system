import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { DoctorAvatar } from '../components/DoctorAvatar';

export const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialty = searchParams.get('specialty_id') || 'all';

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState(initialSpecialty);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const specRes = await api.getSpecialties();
        if (specRes.success) setSpecialties(specRes.specialties);
      } catch (err) {
        console.error('Lỗi tải chuyên khoa:', err);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeSpecialty !== 'all') {
          params.specialty_id = activeSpecialty;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        const res = await api.getDoctors(params);
        if (res.success) setDoctors(res.doctors);
      } catch (err) {
        console.error('Lỗi tải danh sách bác sĩ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [activeSpecialty, searchTerm]);

  const handleSpecialtyChange = (specId) => {
    setActiveSpecialty(specId);
    if (specId === 'all') {
      searchParams.delete('specialty_id');
    } else {
      searchParams.set('specialty_id', specId);
    }
    setSearchParams(searchParams);
  };

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Đội ngũ bác sĩ chuyên khoa</h2>
              <p>
                {loading
                  ? 'Đang tải danh sách bác sĩ...'
                  : `Tìm thấy ${doctors.length} bác sĩ phù hợp`}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="search-box">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên bác sĩ hoặc chuyên môn..."
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Specialty Filter Pills */}
          <div className="pill-row" style={{ marginBottom: '32px' }}>
            <button
              className={`pill ${activeSpecialty === 'all' ? 'active' : ''}`}
              onClick={() => handleSpecialtyChange('all')}
            >
              Tất cả chuyên khoa
            </button>
            {specialties.map((s) => (
              <button
                key={s.id}
                className={`pill ${activeSpecialty === String(s.id) ? 'active' : ''}`}
                onClick={() => handleSpecialtyChange(String(s.id))}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải bác sĩ...</p>
          ) : doctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>Không tìm thấy bác sĩ phù hợp</p>
              <p>Vui lòng thử tìm với từ khóa khác hoặc chọn chuyên khoa khác.</p>
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors.map((doc) => (
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

                  <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '14px 0', flex: 1 }}>
                    {doc.description || 'Chuyên gia uy tín, tận tâm vì sức khỏe bệnh nhân.'}
                  </p>

                  <div style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '14px' }}>
                    <strong>Kinh nghiệm:</strong> {doc.experience_years} năm trong nghề
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/doctors/${doc.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Chi tiết hồ sơ
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
