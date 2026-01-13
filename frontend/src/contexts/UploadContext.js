import React, { createContext, useState, useContext } from 'react';
import { uploadsAPI } from '../services/api/uploads';

const UploadContext = createContext(null);

export const UploadProvider = ({ children }) => {
    const [uploads, setUploads] = useState({});
    const [uploadQueue, setUploadQueue] = useState([]);

    const uploadFile = async (file, options = {}) => {
        const uploadId = Date.now() + Math.random();

        // Initialize upload state
        setUploads(prev => ({
            ...prev,
            [uploadId]: {
                file,
                progress: 0,
                status: 'uploading',
                error: null,
            },
        }));

        try {
            const formData = new FormData();
            formData.append('file', file);

            if (options.type) {
                formData.append('type', options.type);
            }

            if (options.metadata) {
                formData.append('metadata', JSON.stringify(options.metadata));
            }

            const response = await uploadsAPI.upload(formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    setUploads(prev => ({
                        ...prev,
                        [uploadId]: {
                            ...prev[uploadId],
                            progress: percentCompleted,
                        },
                    }));
                },
            });

            // Update to completed
            setUploads(prev => ({
                ...prev,
                [uploadId]: {
                    ...prev[uploadId],
                    status: 'completed',
                    progress: 100,
                    result: response.data,
                },
            }));

            return { success: true, data: response.data, uploadId };
        } catch (error) {
            // Update to failed
            setUploads(prev => ({
                ...prev,
                [uploadId]: {
                    ...prev[uploadId],
                    status: 'failed',
                    error: error.response?.data?.message || 'Upload failed',
                },
            }));

            return {
                success: false,
                error: error.response?.data?.message || 'Upload failed',
                uploadId,
            };
        }
    };

    const uploadMultiple = async (files, options = {}) => {
        const uploadPromises = files.map(file => uploadFile(file, options));
        return Promise.all(uploadPromises);
    };

    const cancelUpload = (uploadId) => {
        setUploads(prev => ({
            ...prev,
            [uploadId]: {
                ...prev[uploadId],
                status: 'cancelled',
            },
        }));
    };

    const removeUpload = (uploadId) => {
        setUploads(prev => {
            const newUploads = { ...prev };
            delete newUploads[uploadId];
            return newUploads;
        });
    };

    const clearCompleted = () => {
        setUploads(prev => {
            const newUploads = {};
            Object.keys(prev).forEach(id => {
                if (prev[id].status !== 'completed') {
                    newUploads[id] = prev[id];
                }
            });
            return newUploads;
        });
    };

    const clearAll = () => {
        setUploads({});
    };

    const getUploadStatus = (uploadId) => {
        return uploads[uploadId] || null;
    };

    const getActiveUploads = () => {
        return Object.entries(uploads)
            .filter(([_, upload]) => upload.status === 'uploading')
            .map(([id, upload]) => ({ id, ...upload }));
    };

    const value = {
        uploads,
        uploadQueue,
        uploadFile,
        uploadMultiple,
        cancelUpload,
        removeUpload,
        clearCompleted,
        clearAll,
        getUploadStatus,
        getActiveUploads,
    };

    return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUpload must be used within UploadProvider');
    }
    return context;
};

export default UploadContext;
