import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments();
      if (res.success) setAppointments(res.appointments);
    } catch (err) {
      console.error('Lỗi tải lịch hẹn bác sĩ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.updateAppointmentStatus(id, newStatus);
      if (res.success) {
        await fetchAppointments();
      }
    } catch (err) {
      alert(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const filteredList = appointments.filter((a) => {
    if (filter === 'all') return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Danh sách bệnh nhân đăng ký khám</h2>
            <p>Xác nhận lịch hẹn khám hoặc đánh dấu hoàn tất ca khám</p>
          </div>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className={`btn-demo ${filter === 'all' ? 'active' : ''}`}
            style={{
              background: filter === 'all' ? 'var(--primary)' : 'white',
              color: filter === 'all' ? 'white' : 'var(--ink)'
            }}
            onClick={() => setFilter('all')}
          >
            Tất cả ({appointments.length})
          </button>
          <button
            className={`btn-demo ${filter === 'pending' ? 'active' : ''}`}
            style={{
              background: filter === 'pending' ? 'var(--primary)' : 'white',
              color: filter === 'pending' ? 'white' : 'var(--ink)'
            }}
            onClick={() => setFilter('pending')}
          >
            Chờ duyệt ({appointments.filter((a) => a.status === 'PENDING').length})
          </button>
          <button
            className={`btn-demo ${filter === 'confirmed' ? 'active' : ''}`}
            style={{
              background: filter === 'confirmed' ? 'var(--primary)' : 'white',
              color: filter === 'confirmed' ? 'white' : 'var(--ink)'
            }}
            onClick={() => setFilter('confirmed')}
          >
            Đã duyệt ({appointments.filter((a) => a.status === 'CONFIRMED').length})
          </button>
          <button
            className={`btn-demo ${filter === 'completed' ? 'active' : ''}`}
            style={{
              background: filter === 'completed' ? 'var(--primary)' : 'white',
              color: filter === 'completed' ? 'white' : 'var(--ink)'
            }}
            onClick={() => setFilter('completed')}
          >
            Đã khám xong ({appointments.filter((a) => a.status === 'COMPLETED').length})
          </button>
          <button
            className={`btn-demo ${filter === 'cancelled' ? 'active' : ''}`}
            style={{
              background: filter === 'cancelled' ? 'var(--primary)' : 'white',
              color: filter === 'cancelled' ? 'white' : 'var(--ink)'
            }}
            onClick={() => setFilter('cancelled')}
          >
            Đã hủy ({appointments.filter((a) => a.status === 'CANCELLED').length})
          </button>
        </div>

        {loading ? (
          <p>Đang tải danh sách lịch khám...</p>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Không có lịch hẹn nào trong mục này.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã số</th>
                  <th>Bệnh nhân</th>
                  <th>SĐT liên hệ</th>
                  <th>Ngày hẹn</th>
                  <th>Khung giờ</th>
                  <th>Lý do / Triệu chứng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.id}</td>
                    <td style={{ fontWeight: '600' }}>{a.patient_name}</td>
                    <td>{a.patient_phone || '—'}</td>
                    <td>{a.appointment_date}</td>
                    <td>{a.start_time}</td>
                    <td>{a.reason || '—'}</td>
                    <td>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>
                        {a.status === 'PENDING'
                          ? 'Chờ duyệt'
                          : a.status === 'CONFIRMED'
                          ? 'Đã duyệt'
                          : a.status === 'COMPLETED'
                          ? 'Hoàn tất'
                          : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {a.status === 'PENDING' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                          >
                            Xác nhận duyệt
                          </button>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px', borderColor: 'var(--success)', color: 'var(--success)' }}
                            onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                          >
                            Hoàn tất ca khám
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};
