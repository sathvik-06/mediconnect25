import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentMonitor.css';

const AppointmentMonitor = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: '',
        status: 'all'
    });

    useEffect(() => {
        fetchAppointments();
    }, [filters]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = '/api/admin/appointments?';
            if (filters.date) url += `date=${filters.date}&`;
            if (filters.status !== 'all') url += `status=${filters.status}&`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments(response.data.appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            alert('Failed to load appointments: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            scheduled: 'status-scheduled',
            confirmed: 'status-confirmed',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return statusColors[status] || '';
    };

    return (
        <div className="appointments-monitor">
            <div className="monitor-header">
                <h2>Appointment Monitor</h2>
                <p className="subtitle">Real-time view of all appointments in the system</p>
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label>Filter by Date:</label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label>Filter by Status:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <button className="btn-refresh" onClick={fetchAppointments}>
                    🔄 Refresh
                </button>
            </div>

            <div className="stats">
                <div className="stat-card">
                    <h3>{appointments.length}</h3>
                    <p>Total Appointments</p>
                </div>
                <div className="stat-card">
                    <h3>{appointments.filter(a => a.status === 'scheduled').length}</h3>
                    <p>Scheduled</p>
                </div>
                <div className="stat-card">
                    <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
                    <p>Confirmed</p>
                </div>
                <div className="stat-card">
                    <h3>{appointments.filter(a => a.status === 'cancelled').length}</h3>
                    <p>Cancelled</p>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading appointments...</div>
            ) : (
                <div className="appointments-table-container">
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Booked On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-data">
                                        No appointments found
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt._id}>
                                        <td>{formatDate(apt.date)}</td>
                                        <td className="time-slot">{apt.timeSlot}</td>
                                        <td>
                                            <div className="person-info">
                                                <strong>{apt.patient?.name || 'N/A'}</strong>
                                                <small>{apt.patient?.email || ''}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="person-info">
                                                <strong>Dr. {apt.doctor?.name || 'N/A'}</strong>
                                                <small>{apt.doctor?.specialization || ''}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(apt.status)}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="booked-time">{formatDateTime(apt.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AppointmentMonitor;
