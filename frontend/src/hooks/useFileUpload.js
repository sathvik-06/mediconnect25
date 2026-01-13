import { useContext } from 'react';
import UploadContext from '../contexts/UploadContext';

export const useFileUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useFileUpload must be used within UploadProvider');
    }
    return context;
};

export default useFileUpload;
