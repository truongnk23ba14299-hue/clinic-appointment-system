const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../../database/data.json');

function getData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { doctors: [], specialties: [] };
  }
}

// Lấy danh sách tất cả bác sĩ (có hỗ trợ lọc theo specialty)
exports.getDoctors = (req, res) => {
  const data = getData();
  const { specialty } = req.query;

  let doctors = data.doctors || [];
  if (specialty) {
    doctors = doctors.filter(d => d.specialty === specialty);
  }

  res.json({
    success: true,
    total: doctors.length,
    data: doctors
  });
};

// Lấy thông tin chi tiết 1 bác sĩ theo ID
exports.getDoctorById = (req, res) => {
  const data = getData();
  const { id } = req.params;

  const doctor = (data.doctors || []).find(d => d.id === id);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy bác sĩ với ID yêu cầu'
    });
  }

  res.json({
    success: true,
    data: doctor
  });
};

// Lấy danh sách chuyên khoa
exports.getSpecialties = (req, res) => {
  const data = getData();
  res.json({
    success: true,
    data: data.specialties || []
  });
};
