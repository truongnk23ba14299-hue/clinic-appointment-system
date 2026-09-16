const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../../database/data.json');

function getData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { services: [] };
  }
}

// Lấy danh sách dịch vụ & gói khám
exports.getServices = (req, res) => {
  const data = getData();
  res.json({
    success: true,
    data: data.services || []
  });
};
