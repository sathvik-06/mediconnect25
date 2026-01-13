import React from 'react';
import './UploadProgress.css';

const UploadProgress = ({ fileName, progress, status, error }) => {
    return (
        <div className={`upload-progress ${status}`}>
            <div className="progress-header">
                <span className="file-name">{fileName}</span>
                <span className="progress-percentage">{progress}%</span>
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {status === 'uploading' && (
                <span className="progress-status">Uploading...</span>
            )}

            {status === 'completed' && (
                <span className="progress-status success">
                    <svg className="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Upload complete
                </span>
            )}

            {status === 'failed' && (
                <span className="progress-status error">
                    <svg className="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {error || 'Upload failed'}
                </span>
            )}
        </div>
    );
};

export default UploadProgress;
