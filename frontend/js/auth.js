/**
 * auth.js - Thư viện quản lý Xác thực, Phân quyền và API Client cho MedBooking
 */

const API_BASE = '/api';

// --- Quản lý phiên làm việc & Token ---
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// --- Gọi API chung với Header Authorization ---
async function apiCall(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await res.json().catch(() => ({}));
    
    // Nếu token hết hạn hoặc không hợp lệ -> đăng xuất
    if (res.status === 401 && !window.location.pathname.includes('login.html')) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      logout();
      return { success: false, message: 'Unauthorized' };
    }

    return { ...json, status: res.status, ok: res.ok };
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại dịch vụ.' };
  }
}

// --- Bảo vệ trang theo Quyền (Role-based Authorization Guard) ---
function requireAuth(allowedRoles = []) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    alert(`Bạn không có quyền truy cập trang này. Quyền yêu cầu: ${allowedRoles.join(', ')}`);
    // Điều hướng về trang phù hợp với role
    if (user.role === 'ADMIN') window.location.href = 'admin.html';
    else if (user.role === 'DOCTOR') window.location.href = 'doctor_appointments.html';
    else window.location.href = 'appointments.html';
    return false;
  }

  return true;
}

// --- Tự động render Header Navbar theo trạng thái đăng nhập ---
function renderNavbar() {
  const navContainer = document.querySelector('.main-nav');
  const actionContainer = document.querySelector('.site-header .wrap');
  if (!navContainer || !actionContainer) return;

  const user = getUser();

  // Xóa nút hành động cũ (nút đặt lịch hoặc login)
  const oldAction = actionContainer.querySelector('.header-auth-action');
  if (oldAction) oldAction.remove();

  let navHtml = `
    <a href="index.html" class="${window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 'active' : ''}">Trang chủ</a>
    <a href="doctors.html" class="${window.location.pathname.includes('doctor') && !window.location.pathname.includes('doctor_appointments') ? 'active' : ''}">Bác sĩ</a>
    <a href="departments.html" class="${window.location.pathname.includes('department') ? 'active' : ''}">Chuyên khoa</a>
  `;

  let actionHtml = '';

  if (!user) {
    // Khách vãng lai chưa đăng nhập
    navHtml += `<a href="services.html">Dịch vụ</a>`;
    actionHtml = `
      <div class="header-auth-action" style="display: flex; gap: 8px; align-items: center;">
        <a href="login.html" class="btn btn-outline btn-sm">Đăng nhập</a>
        <a href="booking.html" class="btn btn-primary btn-sm">Đặt lịch ngay</a>
      </div>
    `;
  } else if (user.role === 'PATIENT') {
    // Bệnh nhân đã đăng nhập
    navHtml += `
      <a href="appointments.html" class="${window.location.pathname.includes('appointments.html') ? 'active' : ''}">Lịch của tôi</a>
    `;
    actionHtml = `
      <div class="header-auth-action" style="display: flex; gap: 10px; align-items: center;">
        <a href="booking.html" class="btn btn-primary btn-sm">Đặt lịch khám</a>
        <span style="font-size: 13px; font-weight: 600; color: var(--text-dark);">👤 ${user.name}</span>
        <button onclick="logout()" class="btn btn-outline btn-sm" style="padding: 6px 10px;">Đăng xuất</button>
      </div>
    `;
  } else if (user.role === 'DOCTOR') {
    // Bác sĩ đã đăng nhập
    navHtml += `
      <a href="doctor_appointments.html" class="${window.location.pathname.includes('doctor_appointments') ? 'active' : ''}">Lịch khám Bác sĩ</a>
    `;
    actionHtml = `
      <div class="header-auth-action" style="display: flex; gap: 10px; align-items: center;">
        <span style="font-size: 13px; font-weight: 600; color: var(--primary);">👨‍⚕️ BS. ${user.name}</span>
        <button onclick="logout()" class="btn btn-outline btn-sm" style="padding: 6px 10px;">Đăng xuất</button>
      </div>
    `;
  } else if (user.role === 'ADMIN') {
    // Quản trị viên
    navHtml += `
      <a href="admin.html" class="${window.location.pathname.includes('admin') ? 'active' : ''}">Quản trị Admin</a>
    `;
    actionHtml = `
      <div class="header-auth-action" style="display: flex; gap: 10px; align-items: center;">
        <span style="font-size: 13px; font-weight: 600; color: #DC2626;">🛡️ Admin: ${user.name}</span>
        <button onclick="logout()" class="btn btn-outline btn-sm" style="padding: 6px 10px;">Đăng xuất</button>
      </div>
    `;
  }

  navContainer.innerHTML = navHtml;
  actionContainer.insertAdjacentHTML('beforeend', actionHtml);
}

// Chạy render navbar khi DOM tải xong
document.addEventListener('DOMContentLoaded', renderNavbar);
