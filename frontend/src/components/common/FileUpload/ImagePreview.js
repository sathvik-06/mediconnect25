import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ file, url, onRemove }) => {
    return (
        <div className="image-preview">
            <img src={url} alt={file?.name || 'Preview'} />
            {onRemove && (
                <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={onRemove}
                    aria-label="Remove image"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            {file && (
                <div className="preview-info">
                    <span className="preview-name">{file.name}</span>
                    <span className="preview-size">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
            )}
        </div>
    );
};

export default ImagePreview;
