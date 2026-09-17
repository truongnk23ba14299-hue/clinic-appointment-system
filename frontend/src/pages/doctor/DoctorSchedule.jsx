import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const DoctorSchedule = () => {
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    start_time: '08:00',
    end_time: '08:30'
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchSchedules = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      // Bác sĩ xem toàn bộ lịch của mình kể cả đã được đặt hay chưa
      const res = await api.getDoctorSchedules(doctorId, { available_only: false });
      if (res.success) setSchedules(res.schedules);
    } catch (err) {
      console.error('Lỗi tải lịch làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.createSchedule(newSchedule);
      if (res.success) {
        setMsg({ type: 'success', text: 'Thêm khung giờ làm việc thành công!' });
        setNewSchedule({ date: '', start_time: '08:00', end_time: '08:30' });
        await fetchSchedules();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Không thể tạo lịch làm việc' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khung giờ làm việc này?')) return;
    try {
      const res = await api.deleteSchedule(id);
      if (res.success) {
        await fetchSchedules();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa lịch làm việc');
    }
  };

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Quản lý lịch làm việc & Khung giờ khám</h2>
            <p>Bác sĩ chủ động thiết lập các ca khám sẵn sàng tiếp nhận bệnh nhân</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '30px', alignItems: 'start' }}>
          {/* Form thêm mới */}
          <div className="form-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>+ Thêm ca khám mới</h3>

            {msg.text && (
              <div
                style={{
                  background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                  border: `1px solid ${msg.type === 'success' ? '#6EE7B7' : '#FCA5A5'}`,
                  color: msg.type === 'success' ? '#065F46' : '#DC2626',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '14px',
                  fontSize: '13px'
                }}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="field">
                <label htmlFor="date">Ngày làm việc *</label>
                <input
                  type="date"
                  id="date"
                  required
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="field">
                  <label htmlFor="start_time">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    id="start_time"
                    required
                    value={newSchedule.start_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="end_time">Giờ kết thúc *</label>
                  <input
                    type="time"
                    id="end_time"
                    required
                    value={newSchedule.end_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
                {submitting ? 'Đang tạo...' : 'Lưu khung giờ khám'}
              </button>
            </form>
          </div>

          {/* Danh sách đã có */}
          <div>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>
              Danh sách ca khám hiện tại ({schedules.length})
            </h3>

            {loading ? (
              <p>Đang tải danh sách...</p>
            ) : schedules.length === 0 ? (
              <div style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <p style={{ margin: 0, color: 'var(--muted)' }}>
                  Bạn chưa có khung giờ khám nào. Hãy tạo khung giờ ở cột bên trái để bệnh nhân có thể đặt lịch.
                </p>
              </div>
            ) : (
              <div className="data-table-container" style={{ marginTop: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ngày</th>
                      <th>Giờ khám</th>
                      <th>Trạng thái slot</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s) => (
                      <tr key={s.id}>
                        <td>#{s.id}</td>
                        <td style={{ fontWeight: '600' }}>{s.date}</td>
                        <td>{s.start_time} - {s.end_time}</td>
                        <td>
                          {s.is_available ? (
                            <span className="badge badge-active">🟢 Trống (Khả dụng)</span>
                          ) : (
                            <span className="badge badge-inactive">🔴 Đã có người đặt</span>
                          )}
                        </td>
                        <td>
                          {s.is_available && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '4px 8px', fontSize: '12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                              onClick={() => handleDelete(s.id)}
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
