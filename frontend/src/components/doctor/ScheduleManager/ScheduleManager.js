import React, { useState, useEffect } from 'react';
import { doctorsService } from '../../../services/api/doctors.js'; // Adjust path if needed
import './ScheduleManager.css'; // Assuming css exists

const ScheduleManager = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Initial availability state
    const [availability, setAvailability] = useState({
        monday: { available: false, start: '09:00', end: '17:00' },
        tuesday: { available: false, start: '09:00', end: '17:00' },
        wednesday: { available: false, start: '09:00', end: '17:00' },
        thursday: { available: false, start: '09:00', end: '17:00' },
        friday: { available: false, start: '09:00', end: '17:00' },
        saturday: { available: false, start: '09:00', end: '17:00' },
        sunday: { available: false, start: '09:00', end: '17:00' }
    });

    // Fetch current profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    // Fetch fresh data
                    const doctorData = await doctorsService.getDoctorById(user.id);

                    // Transform backend format to UI format
                    if (doctorData && doctorData.availability) {
                        const { workingDays, workingHours } = doctorData.availability;
                        const newAvail = { ...availability };

                        // Reset all to unavailable first to be safe, or just update matches
                        // Let's iterate keys to preserve structure
                        Object.keys(newAvail).forEach(day => {
                            const isWorking = workingDays.includes(day);
                            newAvail[day] = {
                                ...newAvail[day],
                                available: isWorking,
                                start: workingHours ? workingHours.start : '09:00',
                                end: workingHours ? workingHours.end : '17:00'
                            };
                        });
                        setAvailability(newAvail);
                    }
                }
            } catch (err) {
                console.error("Failed to load schedule", err);
            }
        };
        fetchProfile();
    }, []); // Removed dependency on 'availability' to avoid infinite loop if we were depending on it, but here [] is correct.

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // Transform UI format to Backend format
            const workingDays = Object.entries(availability)
                .filter(([_, schedule]) => schedule.available)
                .map(([day]) => day);

            // Find first available day to get hours (Backend limitation: one global time)
            const activeDay = Object.values(availability).find(s => s.available);
            const workingHours = {
                start: activeDay ? activeDay.start : '09:00',
                end: activeDay ? activeDay.end : '17:00'
            };

            const payload = {
                availability: {
                    workingDays,
                    workingHours
                }
            };

            await doctorsService.updateProfile(payload);
            setMessage({ type: 'success', text: 'Schedule updated successfully!' });
        } catch (error) {
            console.error('Error saving schedule:', error);
            setMessage({ type: 'error', text: 'Failed to update schedule.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = (day) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                available: !prev[day].available
            }
        }));
    };

    const handleTimeChange = (day, field, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    return (
        <div className="schedule-manager">
            <h2>Schedule Management</h2>
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message.text}
                </div>
            )}
            <div className="schedule-grid">
                {Object.entries(availability).map(([day, schedule]) => (
                    <div key={day} className={`day-row ${schedule.available ? 'active' : 'inactive'}`}>
                        <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        <div className="day-controls">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={schedule.available}
                                    onChange={() => toggleAvailability(day)}
                                />
                                <span className="slider round"></span>
                            </label>
                            {schedule.available && (
                                <div className="time-inputs">
                                    <input
                                        type="time"
                                        value={schedule.start}
                                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                    />
                                    <span>to</span>
                                    <input
                                        type="time"
                                        value={schedule.end}
                                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Schedule'}
            </button>
        </div>
    );
};

export default ScheduleManager;
