import React, { useState, useRef } from 'react';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { validateFile } from '../../../utils/validators';
import './FileUpload.css';

const FileUpload = ({
    onUploadComplete,
    acceptedTypes = 'IMAGE',
    multiple = false,
    maxSize,
    children
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [errors, setErrors] = useState([]);

    const { uploadFile, uploadMultiple } = useFileUpload();
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = [];
        const fileErrors = [];

        files.forEach((file, index) => {
            const validation = validateFile(file, acceptedTypes);
            if (validation.valid) {
                validFiles.push(file);

                // Create preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreviews(prev => [...prev, { file: file.name, url: reader.result }]);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                fileErrors.push({ file: file.name, error: validation.message });
            }
        });

        setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
        setErrors(fileErrors);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        try {
            let result;
            if (multiple) {
                result = await uploadMultiple(selectedFiles, { type: acceptedTypes });
            } else {
                result = await uploadFile(selectedFiles[0], { type: acceptedTypes });
            }

            if (onUploadComplete) {
                onUploadComplete(result);
            }

            // Reset
            setSelectedFiles([]);
            setPreviews([]);
            setErrors([]);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="file-upload-container">
            <div
                className={`file-upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    onChange={handleChange}
                    accept={acceptedTypes === 'IMAGE' ? 'image/*' : 'application/pdf,image/*'}
                    style={{ display: 'none' }}
                />

                {children || (
                    <div className="upload-prompt">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p>Drag and drop files here, or click to select</p>
                        <p className="upload-hint">
                            {acceptedTypes === 'IMAGE' ? 'Images only' : 'PDF or Images'}
                            {maxSize && ` • Max ${Math.round(maxSize / (1024 * 1024))}MB`}
                        </p>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="upload-errors">
                    {errors.map((err, idx) => (
                        <div key={idx} className="error-item">
                            <strong>{err.file}:</strong> {err.error}
                        </div>
                    ))}
                </div>
            )}

            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h4>Selected Files ({selectedFiles.length})</h4>
                    <div className="files-list">
                        {selectedFiles.map((file, idx) => (
                            <div key={idx} className="file-item">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(idx);
                                    }}
                                    className="remove-btn"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleUpload} className="btn btn-primary upload-btn">
                        Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
