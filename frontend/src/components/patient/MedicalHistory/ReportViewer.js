// src/components/patient/MedicalHistory/ReportViewer.js
import React from 'react';

const ReportViewer = ({ reports }) => {
    if (!reports || reports.length === 0) {
        return (
            <div className="empty-state">
                <p>No medical reports available</p>
            </div>
        );
    }

    return (
        <div className="report-viewer">
            {reports.map((report) => (
                <div key={report._id} className="report-card">
                    <div className="report-header">
                        <h3>{report.title}</h3>
                        <span className="report-date">{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <p className="report-description">{report.description}</p>
                    {report.fileUrl && (
                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="view-report-btn">
                            View Report
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportViewer;
