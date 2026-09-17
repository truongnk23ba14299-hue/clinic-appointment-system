// Centralized API Client for Clinic Appointment Booking System

const BASE_URL = '/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Phản hồi từ máy chủ không hợp lệ' };
  }

  if (!response.ok) {
    // Nếu token hết hạn hoặc không hợp lệ (401), và không phải request login/register
    if (response.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    const errorMsg = data.message || `Lỗi yêu cầu (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
};

const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (err) {
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại dịch vụ backend hoặc kết nối mạng.');
    }
    throw err;
  }
};

export const api = {
  // --- AUTH ---
  register: (payload) =>
    request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload)
    }),

  getMe: () =>
    request(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(true)
    }),

  updateProfile: (payload) =>
    request(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  // --- DOCTORS ---
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${BASE_URL}/doctors?${query}`, {
      method: 'GET',
      headers: getHeaders(false)
    });
  },

  getDoctorDetail: (id) =>
    request(`${BASE_URL}/doctors/${id}`, {
      method: 'GET',
      headers: getHeaders(false)
    }),

  createDoctor: (payload) =>
    request(`${BASE_URL}/doctors`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  updateDoctor: (id, payload) =>
    request(`${BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  deleteDoctor: (id) =>
    request(`${BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }),

  // --- SPECIALTIES ---
  getSpecialties: (includeInactive = false) =>
    request(`${BASE_URL}/specialties?include_inactive=${includeInactive}`, {
      method: 'GET',
      headers: getHeaders(false)
    }),

  createSpecialty: (payload) =>
    request(`${BASE_URL}/specialties`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  updateSpecialty: (id, payload) =>
    request(`${BASE_URL}/specialties/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  deleteSpecialty: (id) =>
    request(`${BASE_URL}/specialties/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }),

  // --- SCHEDULES ---
  getDoctorSchedules: (doctorId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${BASE_URL}/doctors/${doctorId}/schedules?${query}`, {
      method: 'GET',
      headers: getHeaders(false)
    });
  },

  createSchedule: (payload) =>
    request(`${BASE_URL}/schedules`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  updateSchedule: (id, payload) =>
    request(`${BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  deleteSchedule: (id) =>
    request(`${BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }),

  // --- APPOINTMENTS ---
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`${BASE_URL}/appointments?${query}`, {
      method: 'GET',
      headers: getHeaders(true)
    });
  },

  getAppointmentDetail: (id) =>
    request(`${BASE_URL}/appointments/${id}`, {
      method: 'GET',
      headers: getHeaders(true)
    }),

  bookAppointment: (payload) =>
    request(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }),

  updateAppointmentStatus: (id, status) =>
    request(`${BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status })
    }),

  cancelAppointment: (id) =>
    request(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    })
};
