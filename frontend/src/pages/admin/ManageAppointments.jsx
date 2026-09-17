import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (doctorFilter) params.doctor_id = doctorFilter;

      const [apptRes, docRes] = await Promise.all([
        api.getAppointments(params),
        api.getDoctors({ include_inactive: true })
      ]);

      if (apptRes.success) setAppointments(apptRes.appointments);
      if (docRes.success) setDoctors(docRes.doctors);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, doctorFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Đổi trạng thái lịch hẹn #${id} thành ${newStatus}?`)) return;
    try {
      const res = await api.updateAppointmentStatus(id, newStatus);
      if (res.success) {
        await fetchData();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy lịch hẹn #${id}?`)) return;
    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        await fetchData();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi hủy lịch hẹn');
    }
  };

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Quản lý Toàn bộ Lịch hẹn khám (Admin)</h2>
            <p>Theo dõi tiến độ khám chữa bệnh trên toàn hệ thống phòng khám</p>
          </div>
        </div>

        {/* Filter controls */}
        <div
          style={{
            background: 'var(--bg-card)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '20px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>Lọc theo Bác sĩ:</label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            >
              <option value="">Tất cả bác sĩ</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>Lọc trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận (PENDING)</option>
              <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
              <option value="COMPLETED">Đã khám xong (COMPLETED)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setStatusFilter('');
              setDoctorFilter('');
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>

        {loading ? (
          <p>Đang nạp danh sách lịch hẹn...</p>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Không tìm thấy lịch hẹn nào theo điều kiện lọc.</p>
          </div>
        ) : (
          <div className="data-table-container" style={{ marginTop: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ phụ trách</th>
                  <th>Ngày khám</th>
                  <th>Khung giờ</th>
                  <th>Lý do khám</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{a.patient_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{a.patient_phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{a.doctor_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--primary-dark)' }}>{a.specialty_name}</div>
                    </td>
                    <td>{a.appointment_date}</td>
                    <td>{a.start_time}</td>
                    <td style={{ maxWidth: '200px' }}>{a.reason || '—'}</td>
                    <td>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>
                        {a.status === 'PENDING'
                          ? 'Chờ duyệt'
                          : a.status === 'CONFIRMED'
                          ? 'Đã duyệt'
                          : a.status === 'COMPLETED'
                          ? 'Đã khám'
                          : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {a.status === 'PENDING' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                          >
                            Duyệt
                          </button>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px', borderColor: 'var(--success)', color: 'var(--success)' }}
                            onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                          >
                            Hoàn tất
                          </button>
                        )}
                        {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            onClick={() => handleCancel(a.id)}
                          >
                            Hủy
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
