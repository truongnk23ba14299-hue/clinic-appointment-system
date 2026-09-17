import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const ManageSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await api.getSpecialties(true);
      if (res.success) setSpecialties(res.specialties);
    } catch (err) {
      console.error('Lỗi nạp chuyên khoa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.createSpecialty({ name, description });
      if (res.success) {
        setMsg({ type: 'success', text: 'Thêm chuyên khoa mới thành công!' });
        setShowModal(false);
        setName('');
        setDescription('');
        await fetchSpecialties();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Không thể tạo chuyên khoa' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (spec) => {
    const actionText = spec.active ? 'vô hiệu hóa' : 'kích hoạt lại';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} chuyên khoa "${spec.name}"?`)) return;

    try {
      if (spec.active) {
        await api.deleteSpecialty(spec.id);
      } else {
        await api.updateSpecialty(spec.id, { active: true });
      }
      await fetchSpecialties();
    } catch (err) {
      alert(err.message || `Lỗi khi ${actionText}`);
    }
  };

  return (
    <main style={{ padding: '40px 20px' }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Quản lý Chuyên khoa (Admin)</h2>
            <p>Thiết lập danh mục các phòng ban và khoa chuyên môn khám chữa bệnh</p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            + Thêm chuyên khoa
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
          <p>Đang nạp danh mục chuyên khoa...</p>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên chuyên khoa</th>
                  <th>Mô tả chi tiết</th>
                  <th>Số bác sĩ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {specialties.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>{s.description || '—'}</td>
                    <td>{s.doctors_count || 0} bác sĩ</td>
                    <td>
                      {s.active ? (
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
                          borderColor: s.active ? 'var(--danger)' : 'var(--primary)',
                          color: s.active ? 'var(--danger)' : 'var(--primary)'
                        }}
                        onClick={() => handleToggleActive(s)}
                      >
                        {s.active ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Thêm Chuyên Khoa */}
        {showModal && (
          <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '16px' }}>Thêm Chuyên khoa mới</h3>
              <form onSubmit={handleCreate}>
                <div className="field">
                  <label>Tên chuyên khoa *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Răng Hàm Mặt, Cơ Xương Khớp..."
                  />
                </div>

                <div className="field">
                  <label>Mô tả chuyên khoa</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả phạm vi thăm khám và điều trị..."
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
                    {submitting ? 'Đang tạo...' : 'Lưu chuyên khoa'}
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
