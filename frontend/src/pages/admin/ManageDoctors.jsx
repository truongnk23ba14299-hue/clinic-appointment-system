import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Doctor@123',
    specialty_id: '',
    phone: '',
    experience_years: 5,
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        api.getDoctors({ include_inactive: true }),
        api.getSpecialties(true)
      ]);
      if (docRes.success) setDoctors(docRes.doctors);
      if (specRes.success) setSpecialties(specRes.specialties);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.createDoctor(formData);
      if (res.success) {
        setMsg({ type: 'success', text: 'Thêm bác sĩ mới thành công!' });
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          password: 'Doctor@123',
          specialty_id: '',
          phone: '',
          experience_years: 5,
          description: ''
        });
        await fetchData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Không thể tạo bác sĩ' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (doctor) => {
    const actionText = doctor.active ? 'vô hiệu hóa' : 'kích hoạt lại';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} bác sĩ ${doctor.name}?`)) return;

    try {
      if (doctor.active) {
        await api.deleteDoctor(doctor.id);
      } else {
        await api.updateDoctor(doctor.id, { active: true });
      }
      await fetchData();
    } catch (err) {
      alert(err.message || `Lỗi khi ${actionText} bác sĩ`);
    }
  };

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Quản lý Đội ngũ Bác sĩ (Admin)</h2>
            <p>Thêm mới, điều chỉnh thông tin và phân công chuyên khoa cho bác sĩ</p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            + Thêm bác sĩ mới
          </button>
        </div>

        {msg.text && (
          <div
            style={{
              background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${msg.type === 'success' ? '#6EE7B7' : '#FCA5A5'}`,
              color: msg.type === 'success' ? '#065F46' : '#DC2626',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            {msg.text}
          </div>
        )}

        {loading ? (
          <p>Đang nạp danh sách bác sĩ...</p>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Chuyên khoa</th>
                  <th>Số điện thoại</th>
                  <th>Kinh nghiệm</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>#{doc.id}</td>
                    <td style={{ fontWeight: '600' }}>{doc.name}</td>
                    <td>{doc.email || '—'}</td>
                    <td>{doc.specialty_name}</td>
                    <td>{doc.phone || '—'}</td>
                    <td>{doc.experience_years} năm</td>
                    <td>
                      {doc.active ? (
                        <span className="badge badge-active">Hoạt động</span>
                      ) : (
                        <span className="badge badge-inactive">Vô hiệu hóa</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          borderColor: doc.active ? 'var(--danger)' : 'var(--primary)',
                          color: doc.active ? 'var(--danger)' : 'var(--primary)'
                        }}
                        onClick={() => handleToggleActive(doc)}
                      >
                        {doc.active ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Thêm Bác Sĩ */}
        {showModal && (
          <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card" style={{ maxWidth: '540px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '16px' }}>Thêm Bác sĩ mới vào hệ thống</h3>

              <form onSubmit={handleCreateDoctor}>
                <div className="field">
                  <label>Họ và tên bác sĩ *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: PGS.TS Trần Văn Hùng"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="field">
                    <label>Email đăng nhập *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="bacsi@clinic.com"
                    />
                  </div>

                  <div className="field">
                    <label>Mật khẩu khởi tạo *</label>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="field">
                    <label>Chuyên khoa phụ trách *</label>
                    <select
                      required
                      value={formData.specialty_id}
                      onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
                    >
                      <option value="">— Chọn khoa —</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912..."
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Mô tả / Tiểu sử chuyên môn</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu học vấn, thế mạnh chuyên sâu..."
                  />
                </div>

                <div className="modal-actions" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={submitting}
                    onClick={() => setShowModal(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Đang tạo...' : 'Lưu hồ sơ bác sĩ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
