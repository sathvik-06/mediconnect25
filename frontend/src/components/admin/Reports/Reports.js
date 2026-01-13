import React from 'react';
import './Reports.css';

const Reports = () => {
    const reports = [
        { id: 1, name: 'Monthly Financial Report', date: '2023-10-01', type: 'PDF', size: '2.4 MB' },
        { id: 2, name: 'User Activity Log', date: '2023-10-05', type: 'CSV', size: '1.1 MB' },
        { id: 3, name: 'Appointment Statistics', date: '2023-10-10', type: 'Excel', size: '850 KB' },
        { id: 4, name: 'Pharmacy Inventory Status', date: '2023-10-12', type: 'PDF', size: '1.8 MB' },
    ];

    return (
        <div className="reports">
            <h2>System Reports</h2>
            <div className="reports-list">
                {reports.map(report => (
                    <div key={report.id} className="report-item">
                        <div className="report-icon">{report.type}</div>
                        <div className="report-info">
                            <h4>{report.name}</h4>
                            <p>{report.date} • {report.size}</p>
                        </div>
                        <button className="btn-download">Download</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
