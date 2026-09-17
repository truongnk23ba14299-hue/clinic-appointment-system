import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
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

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;

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

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Bảng điều khiển Bác sĩ</h2>
            <p>Xin chào, {user?.name}! Dưới đây là tổng quan ca khám và lịch hẹn của bạn.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/doctor/schedule" className="btn btn-outline btn-sm">
              ⚙️ Quản lý lịch làm việc
            </Link>
            <Link to="/doctor/appointments" className="btn btn-primary btn-sm">
              📋 Danh sách khám
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <span className="label">Chờ xác nhận</span>
            <span className="value" style={{ color: '#D97706' }}>
              {pendingCount}
            </span>
            <span className="subtext">Cần bác sĩ duyệt tiếp nhận</span>
          </div>

          <div className="stat-card">
            <span className="label">Đã xác nhận</span>
            <span className="value" style={{ color: '#2563EB' }}>
              {confirmedCount}
            </span>
            <span className="subtext">Sắp tới trong kế hoạch khám</span>
          </div>

          <div className="stat-card">
            <span className="label">Đã khám xong</span>
            <span className="value" style={{ color: '#059669' }}>
              {completedCount}
            </span>
            <span className="subtext">Ca khám đã hoàn tất</span>
          </div>

          <div className="stat-card">
            <span className="label">Tổng số lịch hẹn</span>
            <span className="value">{appointments.length}</span>
            <span className="subtext">Ghi nhận trong toàn bộ hồ sơ</span>
          </div>
        </div>

        {/* Recent Pending or Upcoming Appointments Table */}
        <div className="dept-section" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Lịch hẹn cần xử lý gần đây</h3>
            <Link to="/doctor/appointments" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : appointments.length === 0 ? (
            <p style={{ color: 'var(--muted)', padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
              Hiện chưa có lịch hẹn nào được phân công.
            </p>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Bệnh nhân</th>
                    <th>Số điện thoại</th>
                    <th>Ngày khám</th>
                    <th>Giờ khám</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((a) => (
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
                            ? 'Hoàn thành'
                            : 'Đã hủy'}
                        </span>
                      </td>
                      <td>
                        {a.status === 'PENDING' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}
                          >
                            Xác nhận
                          </button>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px', borderColor: 'var(--success)', color: 'var(--success)' }}
                            onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                          >
                            Hoàn tất khám
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
    </main>
  );
};
