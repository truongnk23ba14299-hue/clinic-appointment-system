import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctorsCount: 0,
    specialtiesCount: 0,
    appointmentsCount: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [docRes, specRes, apptRes] = await Promise.all([
          api.getDoctors({ include_inactive: true }),
          api.getSpecialties(true),
          api.getAppointments()
        ]);

        const appts = apptRes.appointments || [];
        setStats({
          doctorsCount: docRes.count || (docRes.doctors ? docRes.doctors.length : 0),
          specialtiesCount: specRes.count || (specRes.specialties ? specRes.specialties.length : 0),
          appointmentsCount: appts.length,
          pendingAppointments: appts.filter((a) => a.status === 'PENDING').length,
          completedAppointments: appts.filter((a) => a.status === 'COMPLETED').length
        });
      } catch (err) {
        console.error('Lỗi tải số liệu thống kê quản trị:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Bảng điều khiển Quản trị viên (Admin)</h2>
            <p>Hệ thống giám sát và quản lý tổng thể phòng khám Group 9</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/doctors" className="btn btn-primary btn-sm">
              👨‍⚕️ Quản lý Bác sĩ
            </Link>
            <Link to="/admin/specialties" className="btn btn-outline btn-sm">
              🏥 Quản lý Chuyên khoa
            </Link>
            <Link to="/admin/appointments" className="btn btn-outline btn-sm">
              📅 Quản lý Lịch hẹn
            </Link>
          </div>
        </div>

        {loading ? (
          <p>Đang tải số liệu hệ thống...</p>
        ) : (
          <div className="dashboard-grid">
            <div className="stat-card">
              <span className="label">Đội ngũ Bác sĩ</span>
              <span className="value" style={{ color: 'var(--primary)' }}>
                {stats.doctorsCount}
              </span>
              <span className="subtext">Bác sĩ hiện diện trong cơ sở dữ liệu</span>
            </div>

            <div className="stat-card">
              <span className="label">Chuyên khoa</span>
              <span className="value" style={{ color: '#6366F1' }}>
                {stats.specialtiesCount}
              </span>
              <span className="subtext">Các chuyên khoa đang hoạt động</span>
            </div>

            <div className="stat-card">
              <span className="label">Lịch hẹn cần duyệt</span>
              <span className="value" style={{ color: '#D97706' }}>
                {stats.pendingAppointments}
              </span>
              <span className="subtext">Đang ở trạng thái PENDING</span>
            </div>

            <div className="stat-card">
              <span className="label">Tổng số lượt khám</span>
              <span className="value">{stats.appointmentsCount}</span>
              <span className="subtext">
                {stats.completedAppointments} lượt khám đã hoàn tất
              </span>
            </div>
          </div>
        )}

        <div className="feature-grid" style={{ marginTop: '20px' }}>
          <div className="feature-card">
            <div className="icon-box">👨‍⚕️</div>
            <h3>Quản lý Bác sĩ</h3>
            <p>Thêm mới bác sĩ, gán chuyên khoa, cập nhật năm kinh nghiệm hoặc kích hoạt/vô hiệu hóa hồ sơ.</p>
            <Link to="/admin/doctors" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
              Vào quản lý Bác sĩ →
            </Link>
          </div>

          <div className="feature-card">
            <div className="icon-box">🏥</div>
            <h3>Quản lý Chuyên khoa</h3>
            <p>Thêm các chuyên khoa mới hoặc chỉnh sửa mô tả dịch vụ các khoa chuyên môn.</p>
            <Link to="/admin/specialties" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
              Vào quản lý Chuyên khoa →
            </Link>
          </div>

          <div className="feature-card">
            <div className="icon-box">📅</div>
            <h3>Toàn bộ Lịch hẹn khám</h3>
            <p>Kiểm tra danh sách toàn bộ các lịch khám từ bệnh nhân, can thiệp đổi trạng thái hoặc hủy lịch.</p>
            <Link to="/admin/appointments" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
              Vào quản lý Lịch hẹn →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
