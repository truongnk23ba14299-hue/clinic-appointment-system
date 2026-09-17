import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

export const MyAppointments = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled
  const [cancelModalId, setCancelModalId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [notification, setNotification] = useState(location.state?.message || '');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments();
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error('Lỗi tải lịch hẹn:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelModalId) return;
    setCancelling(true);
    try {
      const res = await api.cancelAppointment(cancelModalId);
      if (res.success) {
        setNotification('Đã hủy lịch hẹn thành công. Khung giờ khám đã được mở lại cho bệnh nhân khác.');
        setCancelModalId(null);
        await fetchAppointments();
      }
    } catch (err) {
      alert(err.message || 'Không thể hủy lịch hẹn này');
    } finally {
      setCancelling(false);
    }
  };

  const filteredList = appointments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return a.status === 'PENDING' || a.status === 'CONFIRMED';
    if (filter === 'completed') return a.status === 'COMPLETED';
    if (filter === 'cancelled') return a.status === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending">Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="badge badge-confirmed">Đã xác nhận</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">Đã hoàn thành</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled">Đã hủy</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <main>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Lịch khám bệnh của tôi</h2>
              <p>Theo dõi thời gian, bác sĩ phụ trách và quản lý lịch hẹn cá nhân</p>
            </div>
            <Link to="/patient/appointments/book" className="btn btn-primary btn-sm">
              + Đặt lịch mới
            </Link>
          </div>

          {notification && (
            <div
              style={{
                background: '#ECFDF5',
                border: '1px solid #6EE7B7',
                color: '#065F46',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{notification}</span>
              <button
                type="button"
                onClick={() => setNotification('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="appt-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              className={`appt-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tất cả ({appointments.length})
            </button>
            <button
              className={`appt-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Sắp tới ({appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED').length})
            </button>
            <button
              className={`appt-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Đã khám ({appointments.filter((a) => a.status === 'COMPLETED').length})
            </button>
            <button
              className={`appt-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Đã hủy ({appointments.filter((a) => a.status === 'CANCELLED').length})
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px 0' }}>Đang tải danh sách lịch hẹn...</p>
          ) : filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '16px' }}>
                Không tìm thấy lịch hẹn nào trong danh mục này.
              </p>
              <Link to="/patient/appointments/book" className="btn btn-primary btn-sm">
                Đặt lịch khám ngay
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredList.map((appt) => {
                const canCancel = appt.status === 'PENDING' || appt.status === 'CONFIRMED';
                return (
                  <div
                    key={appt.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        {getStatusBadge(appt.status)}
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Mã lịch: #{appt.id}</span>
                      </div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--ink)' }}>
                        {appt.doctor_name}
                      </h3>
                      <div style={{ fontSize: '14px', color: 'var(--primary-dark)', fontWeight: '600' }}>
                        Chuyên khoa: {appt.specialty_name}
                      </div>
                    </div>

                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                        📅 <strong>Ngày khám:</strong> {appt.appointment_date}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--ink)' }}>
                        ⏰ <strong>Giờ khám:</strong> {appt.start_time}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2px' }}>Lý do khám:</div>
                      <div style={{ fontSize: '14px', color: 'var(--ink)', fontStyle: appt.reason ? 'normal' : 'italic' }}>
                        {appt.reason || 'Không ghi chú triệu chứng'}
                      </div>
                    </div>

                    <div>
                      {canCancel && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          onClick={() => setCancelModalId(appt.id)}
                        >
                          Hủy lịch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal Hủy Lịch */}
      {cancelModalId && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-icon danger">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>Xác nhận hủy lịch hẹn?</h3>
            <p>
              Bạn có chắc chắn muốn hủy lịch hẹn khám <strong>#{cancelModalId}</strong>? Khung giờ khám này sẽ được mở lại cho bệnh nhân khác.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                disabled={cancelling}
                onClick={() => setCancelModalId(null)}
              >
                Quay lại
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={cancelling}
                onClick={handleConfirmCancel}
              >
                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy lịch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
