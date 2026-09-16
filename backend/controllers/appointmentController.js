const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../../database/data.json');

function getData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { appointments: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Lấy danh sách lịch hẹn
exports.getAppointments = (req, res) => {
  const data = getData();
  res.json({
    success: true,
    data: data.appointments || []
  });
};

// Đặt lịch hẹn mới
exports.createAppointment = (req, res) => {
  const { name, phone, email, doctorId, doctorName, specialty, date, time, reason } = req.body;

  if (!name || !phone || !doctorId || !date || !time) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (họ tên, sđt, bác sĩ, ngày, giờ).'
    });
  }

  const data = getData();
  if (!data.appointments) data.appointments = [];

  const newAppointment = {
    id: 'apt_' + Date.now(),
    patientName: name,
    patientPhone: phone,
    patientEmail: email || '',
    doctorId,
    doctorName,
    specialty,
    date,
    time,
    reason: reason || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  data.appointments.unshift(newAppointment);
  saveData(data);

  res.status(201).json({
    success: true,
    message: 'Đặt lịch khám thành công!',
    data: newAppointment
  });
};
