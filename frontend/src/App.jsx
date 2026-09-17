import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Doctors } from './pages/Doctors';
import { DoctorDetail } from './pages/DoctorDetail';
import { Specialties } from './pages/Specialties';

// Patient Pages
import { BookAppointment } from './pages/patient/BookAppointment';
import { MyAppointments } from './pages/patient/MyAppointments';
import { PatientProfile } from './pages/patient/PatientProfile';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageDoctors } from './pages/admin/ManageDoctors';
import { ManageSpecialties } from './pages/admin/ManageSpecialties';
import { ManageAppointments } from './pages/admin/ManageAppointments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/specialties" element={<Specialties />} />

              {/* --- PATIENT ROUTES --- */}
              <Route
                path="/patient/appointments/book"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />

              {/* --- DOCTOR ROUTES --- */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorAppointments />
                  </ProtectedRoute>
                }
              />

              {/* --- ADMIN ROUTES --- */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageDoctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/specialties"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageSpecialties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageAppointments />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
