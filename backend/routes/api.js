const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');
const appointmentController = require('../controllers/appointmentController');
const serviceController = require('../controllers/serviceController');

// Routes Bác sĩ & Chuyên khoa
router.get('/doctors', doctorController.getDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.get('/specialties', doctorController.getSpecialties);

// Routes Lịch hẹn
router.get('/appointments', appointmentController.getAppointments);
router.post('/appointments', appointmentController.createAppointment);

// Routes Dịch vụ
router.get('/services', serviceController.getServices);

module.exports = router;
