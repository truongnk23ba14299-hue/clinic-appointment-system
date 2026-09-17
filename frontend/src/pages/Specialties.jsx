import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await api.getSpecialties();
        if (res.success) setSpecialties(res.specialties);
      } catch (err) {
        console.error('Lỗi tải danh mục chuyên khoa:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Danh mục chuyên khoa</h2>
              <p>Phòng khám Group 9 cung cấp đầy đủ các chuyên khoa với đội ngũ bác sĩ uy tín</p>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải danh mục chuyên khoa...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {specialties.map((spec) => (
                <div
                  key={spec.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--primary-dark)' }}>
                      {spec.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                      {spec.description || 'Chuyên khoa chăm sóc và điều trị chuyên sâu.'}
                    </p>
                  </div>
                  <div>
                    <Link
                      to={`/doctors?specialty_id=${spec.id}`}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      Xem các bác sĩ phụ trách →
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
