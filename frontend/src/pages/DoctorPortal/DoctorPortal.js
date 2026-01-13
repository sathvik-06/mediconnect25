import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../../components/doctor/Dashboard/DoctorDashboard';
import ScheduleManager from '../../components/doctor/ScheduleManager/ScheduleManager';
import PatientRecords from '../../components/doctor/PatientRecords/PatientRecords';
import Consultation from '../../components/doctor/Consultation/Consultation';
import VideoCall from '../../components/common/VideoCall/VideoCall';
import DoctorQueue from '../../components/doctor/Queue/DoctorQueue';
import DoctorLayout from './DoctorLayout';
import './DoctorPortal.css';

const DoctorPortal = () => {
    return (
        <DoctorLayout>
            <Routes>
                <Route path="/dashboard" element={<DoctorDashboard />} />
                <Route path="/queue" element={<DoctorQueue />} />
                <Route path="/schedule" element={<ScheduleManager />} />
                <Route path="/patients" element={<PatientRecords />} />
                <Route path="/consultation/:appointmentId" element={<Consultation />} />
                <Route path="/video/:appointmentId" element={<VideoCall userType="doctor" />} />
            </Routes>
        </DoctorLayout>
    );
};

export default DoctorPortal;
