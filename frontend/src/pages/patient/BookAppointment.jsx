import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctor_id') || '';
  const initialScheduleId = searchParams.get('schedule_id') || '';

  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(initialScheduleId);
  const [reason, setReason] = useState('');
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingScheds, setLoadingScheds] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Tải danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        if (res.success) setDoctors(res.doctors);
      } catch (err) {
        console.error('Lỗi tải bác sĩ:', err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  // 2. Tải lịch khi chọn Bác sĩ
  useEffect(() => {
    if (!selectedDoctorId) {
      setSchedules([]);
      return;
    }

    const fetchSchedules = async () => {
      setLoadingScheds(true);
      setError('');
      try {
        const params = { available_only: true };
        if (selectedDate) params.date = selectedDate;
        const res = await api.getDoctorSchedules(selectedDoctorId, params);
        if (res.success) {
          setSchedules(res.schedules);
          // Nếu có initialScheduleId và schedule đó có trong list thì giữ nguyên
          if (initialScheduleId && res.schedules.some((s) => String(s.id) === String(initialScheduleId))) {
            setSelectedScheduleId(initialScheduleId);
          }
        }
      } catch (err) {
        console.error('Lỗi tải lịch:', err);
      } finally {
        setLoadingScheds(false);
      }
    };

    fetchSchedules();
  }, [selectedDoctorId, selectedDate, initialScheduleId]);

  const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));
  const selectedSchedule = schedules.find((s) => String(s.id) === String(selectedScheduleId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctorId) {
      setError('Vui lòng chọn bác sĩ khám');
      return;
    }

    if (!selectedScheduleId) {
      setError('Vui lòng chọn khung giờ khám khả dụng');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.bookAppointment({
        doctor_id: parseInt(selectedDoctorId),
        schedule_id: parseInt(selectedScheduleId),
        reason: reason.trim()
      });

      if (res.success) {
        navigate('/patient/appointments', {
          state: { message: 'Đặt lịch hẹn thành công! Lịch đang ở trạng thái Chờ xác nhận (PENDING).' }
        });
      }
    } catch (err) {
      setError(err.message || 'Không thể đặt lịch hẹn. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Đặt lịch khám bệnh trực tuyến</h2>
              <p>Chọn bác sĩ chuyên khoa và khung giờ còn trống để giữ chỗ ngay lập tức</p>
            </div>
          </div>

          <div className="booking-container">
            {/* Form Card */}
            <form className="form-card" onSubmit={handleSubmit}>
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

              {/* 1. Chọn Bác sĩ */}
              <div className="field">
                <label htmlFor="doctor">1. Chọn bác sĩ khám *</label>
                <select
                  id="doctor"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    setSelectedScheduleId('');
                  }}
                  required
                >
                  <option value="">— Chọn bác sĩ —</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty_name} ({d.experience_years} năm KN)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Lọc theo ngày */}
              <div className="field">
                <label htmlFor="date">2. Lọc theo ngày khám (tùy chọn)</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedScheduleId('');
                  }}
                />
              </div>

              {/* 3. Chọn khung giờ khám */}
              <div className="field">
                <label>3. Chọn khung giờ khám khả dụng *</label>
                {loadingScheds ? (
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Đang tìm các khung giờ trống...</p>
                ) : !selectedDoctorId ? (
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Vui lòng chọn bác sĩ trước để xem lịch trống.</p>
                ) : schedules.length === 0 ? (
                  <p style={{ color: 'var(--danger)', fontSize: '14px' }}>
                    Không còn khung giờ trống nào cho bác sĩ này trong ngày đã chọn. Vui lòng chọn ngày khác.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                      gap: '10px',
                      marginTop: '8px'
                    }}
                  >
                    {schedules.map((sch) => {
                      const isSelected = String(sch.id) === String(selectedScheduleId);
                      return (
                        <button
                          type="button"
                          key={sch.id}
                          onClick={() => setSelectedScheduleId(sch.id)}
                          style={{
                            padding: '10px 12px',
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                            color: isSelected ? 'var(--primary-dark)' : 'var(--ink)',
                            fontWeight: isSelected ? '700' : '500',
                            fontSize: '13px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div>📅 {sch.date}</div>
                          <div style={{ marginTop: '4px' }}>⏰ {sch.start_time}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Triệu chứng lý do */}
              <div className="field">
                <label htmlFor="reason">4. Triệu chứng hoặc lý do khám</label>
                <textarea
                  id="reason"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ví dụ: Đau đầu, sốt nhẹ 2 ngày nay, khó ngủ..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={submitting || !selectedScheduleId}
              >
                {submitting ? 'Đang tiến hành giữ chỗ...' : 'Xác nhận đặt lịch khám'}
              </button>
            </form>

            {/* Right Summary Sidebar */}
            <div className="booking-summary-card">
              <h3>Tóm tắt lịch hẹn</h3>
              <div className="summary-item">
                <span className="label">Người khám:</span>
                <span className="val">{user?.name || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Bác sĩ:</span>
                <span className="val">{selectedDoctor?.name || 'Chưa chọn'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Chuyên khoa:</span>
                <span className="val">{selectedDoctor?.specialty_name || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Ngày khám:</span>
                <span className="val">{selectedSchedule?.date || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Khung giờ:</span>
                <span className="val">
                  {selectedSchedule ? `${selectedSchedule.start_time} - ${selectedSchedule.end_time}` : '—'}
                </span>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  background: '#F0FDFA',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--primary-dark)',
                  lineHeight: 1.5
                }}
              >
                💡 <strong>Lưu ý:</strong> Sau khi xác nhận, lịch hẹn sẽ ở trạng thái Chờ xác nhận (PENDING). Bác sĩ sẽ kiểm tra và xác nhận lịch hẹn của bạn.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
