// Format date to readable string
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Format time to readable string
export const formatTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string' && time.includes(':')) {
        return time;
    }
    const d = new Date(time);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Format datetime
export const formatDateTime = (datetime) => {
    if (!datetime) return '';
    return `${formatDate(datetime)} ${formatTime(datetime)}`;
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(date);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format currency
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Generate random color for avatar
export const getAvatarColor = (name) => {
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
        '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
    ];

    if (!name) return colors[0];

    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
};

// Debounce function
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
};

// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Download file
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

// Get file extension
export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Check if date is today
export const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

// Check if date is in past
export const isPast = (date) => {
    return new Date(date) < new Date();
};

// Get age from date of birth
export const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export default {
    formatDate,
    formatTime,
    formatDateTime,
    getRelativeTime,
    truncateText,
    capitalize,
    formatCurrency,
    formatPhoneNumber,
    getInitials,
    getAvatarColor,
    debounce,
    throttle,
    deepClone,
    isEmpty,
    groupBy,
    sortBy,
    generateId,
    downloadFile,
    copyToClipboard,
    getFileExtension,
    formatFileSize,
    isToday,
    isPast,
    getAge,
};
