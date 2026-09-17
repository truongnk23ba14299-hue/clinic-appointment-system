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
    if (response.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear token nếu có
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
    }
    const errorMsg = data.message || `Lỗi yêu cầu (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // --- AUTH ---
  register: (payload) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  login: (payload) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(true)
    }).then(handleResponse),

  updateProfile: (payload) =>
    fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  // --- DOCTORS ---
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/doctors?${query}`, {
      method: 'GET',
      headers: getHeaders(false)
    }).then(handleResponse);
  },

  getDoctorDetail: (id) =>
    fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'GET',
      headers: getHeaders(false)
    }).then(handleResponse),

  createDoctor: (payload) =>
    fetch(`${BASE_URL}/doctors`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateDoctor: (id, payload) =>
    fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  deleteDoctor: (id) =>
    fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }).then(handleResponse),

  // --- SPECIALTIES ---
  getSpecialties: (includeInactive = false) =>
    fetch(`${BASE_URL}/specialties?include_inactive=${includeInactive}`, {
      method: 'GET',
      headers: getHeaders(false)
    }).then(handleResponse),

  createSpecialty: (payload) =>
    fetch(`${BASE_URL}/specialties`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateSpecialty: (id, payload) =>
    fetch(`${BASE_URL}/specialties/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  deleteSpecialty: (id) =>
    fetch(`${BASE_URL}/specialties/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }).then(handleResponse),

  // --- SCHEDULES ---
  getDoctorSchedules: (doctorId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/doctors/${doctorId}/schedules?${query}`, {
      method: 'GET',
      headers: getHeaders(false)
    }).then(handleResponse);
  },

  createSchedule: (payload) =>
    fetch(`${BASE_URL}/schedules`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateSchedule: (id, payload) =>
    fetch(`${BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  deleteSchedule: (id) =>
    fetch(`${BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }).then(handleResponse),

  // --- APPOINTMENTS ---
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/appointments?${query}`, {
      method: 'GET',
      headers: getHeaders(true)
    }).then(handleResponse);
  },

  getAppointmentDetail: (id) =>
    fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'GET',
      headers: getHeaders(true)
    }).then(handleResponse),

  bookAppointment: (payload) =>
    fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateAppointmentStatus: (id, status) =>
    fetch(`${BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  cancelAppointment: (id) =>
    fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    }).then(handleResponse)
};
