import React from 'react';
import { useParams } from 'react-router-dom';

const Consultation = () => {
    const { appointmentId } = useParams();

    return (
        <div className="consultation">
            <h2>Consultation Room</h2>
            <p>Appointment ID: {appointmentId}</p>
            <div className="consultation-content">
                <div className="video-area">
                    <div className="placeholder-video">Video Call Area</div>
                </div>
                <div className="notes-area">
                    <h3>Clinical Notes</h3>
                    <textarea placeholder="Enter diagnosis and prescription notes..." rows="10" style={{ width: '100%' }}></textarea>
                </div>
            </div>
        </div>
    );
};

export default Consultation;
