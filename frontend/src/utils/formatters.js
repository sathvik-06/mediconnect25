// Format date for display
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Format time for display
export const formatTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string' && time.includes(':')) {
        return time;
    }
    const d = new Date(time);
    return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// Format currency
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
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

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    return `${parseFloat(value).toFixed(decimals)}%`;
};

// Format number with commas
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format address
export const formatAddress = (address) => {
    if (!address) return '';
    const { street, city, state, pinCode } = address;
    return [street, city, state, pinCode].filter(Boolean).join(', ');
};

// Format duration (in minutes)
export const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// Format status badge text
export const formatStatus = (status) => {
    if (!status) return '';
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export default {
    formatDate,
    formatTime,
    formatCurrency,
    formatPhoneNumber,
    formatFileSize,
    formatPercentage,
    formatNumber,
    formatAddress,
    formatDuration,
    formatStatus,
};
