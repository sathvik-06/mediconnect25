// src/pages/PatientPortal/PatientPortal.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientDashboard from '../../components/patient/Dashboard/PatientDashboard';
import DoctorSearch from '../../components/patient/DoctorSearch/DoctorSearch';
import DoctorProfile from '../../components/patient/DoctorSearch/DoctorProfile';
import AppointmentBooking from '../../components/patient/AppointmentBooking/AppointmentBooking';
import MedicalHistory from '../../components/patient/MedicalHistory/MedicalHistory';
import PrescriptionUpload from '../../components/patient/PrescriptionUpload/PrescriptionUpload';
import NotificationsCenter from '../../components/patient/Notifications/NotificationsCenter';
import PatientOrders from '../../components/patient/PatientOrders/PatientOrders';
import VideoCall from '../../components/common/VideoCall/VideoCall';
import PatientLayout from './PatientLayout';
import './PatientPortal.css';

const PatientPortal = () => {
  return (
    <PatientLayout>
      <Routes>
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/doctors" element={<DoctorSearch />} />
        <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        <Route path="/book-appointment/:doctorId?" element={<AppointmentBooking />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/prescriptions" element={<PrescriptionUpload />} />
        <Route path="/orders" element={<PatientOrders />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/video/:appointmentId" element={<VideoCall userType="patient" />} />
      </Routes>
    </PatientLayout>
  );
};

export default PatientPortal;