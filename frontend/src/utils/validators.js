import { REGEX_PATTERNS, MAX_FILE_SIZES, ALLOWED_FILE_TYPES } from './constants';

// Validate email
export const validateEmail = (email) => {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }
    if (!REGEX_PATTERNS.EMAIL.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
};

// Validate phone number
export const validatePhone = (phone) => {
    if (!phone) {
        return { valid: false, message: 'Phone number is required' };
    }
    const cleaned = phone.replace(/\D/g, '');
    if (!REGEX_PATTERNS.PHONE.test(cleaned)) {
        return { valid: false, message: 'Invalid phone number. Must be 10 digits starting with 6-9' };
    }
    return { valid: true };
};

// Validate password
export const validatePassword = (password) => {
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!REGEX_PATTERNS.PASSWORD.test(password)) {
        return {
            valid: false,
            message: 'Password must contain uppercase, lowercase, number, and special character',
        };
    }
    return { valid: true };
};

// Validate name
export const validateName = (name) => {
    if (!name) {
        return { valid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters long' };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return { valid: false, message: 'Name can only contain letters and spaces' };
    }
    return { valid: true };
};

// Validate age
export const validateAge = (age) => {
    if (!age) {
        return { valid: false, message: 'Age is required' };
    }
    const numAge = parseInt(age);
    if (isNaN(numAge) || numAge < 0 || numAge > 150) {
        return { valid: false, message: 'Invalid age' };
    }
    return { valid: true };
};

// Validate date
export const validateDate = (date) => {
    if (!date) {
        return { valid: false, message: 'Date is required' };
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return { valid: false, message: 'Invalid date' };
    }
    return { valid: true };
};

// Validate future date
export const validateFutureDate = (date) => {
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) return dateValidation;

    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (d < today) {
        return { valid: false, message: 'Date must be in the future' };
    }
    return { valid: true };
};

// Validate file
export const validateFile = (file, type = 'IMAGE') => {
    if (!file) {
        return { valid: false, message: 'File is required' };
    }

    // Check file size
    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.IMAGE;
    if (file.size > maxSize) {
        return {
            valid: false,
            message: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
        };
    }

    // Check file type
    const allowedTypes = ALLOWED_FILE_TYPES[type] || ALLOWED_FILE_TYPES.IMAGE;
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        };
    }

    return { valid: true };
};

// Validate PIN code
export const validatePinCode = (pinCode) => {
    if (!pinCode) {
        return { valid: false, message: 'PIN code is required' };
    }
    if (!REGEX_PATTERNS.PIN_CODE.test(pinCode)) {
        return { valid: false, message: 'Invalid PIN code. Must be 6 digits' };
    }
    return { valid: true };
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
};

// Validate number
export const validateNumber = (value, min, max, fieldName = 'Value') => {
    if (value === null || value === undefined || value === '') {
        return { valid: false, message: `${fieldName} is required` };
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
        return { valid: false, message: `${fieldName} must be a number` };
    }

    if (min !== undefined && num < min) {
        return { valid: false, message: `${fieldName} must be at least ${min}` };
    }

    if (max !== undefined && num > max) {
        return { valid: false, message: `${fieldName} must be at most ${max}` };
    }

    return { valid: true };
};

// Validate form
export const validateForm = (formData, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = formData[field];

        if (rule.required) {
            const validation = validateRequired(value, rule.label || field);
            if (!validation.valid) {
                errors[field] = validation.message;
                return;
            }
        }

        if (rule.type === 'email') {
            const validation = validateEmail(value);
            if (!validation.valid) errors[field] = validation.message;
        }

        if (rule.type === 'phone') {
            const validation = validatePhone(value);
            if (!validation.valid) errors[field] = validation.message;
        }

        if (rule.type === 'password') {
            const validation = validatePassword(value);
            if (!validation.valid) errors[field] = validation.message;
        }

        if (rule.type === 'number') {
            const validation = validateNumber(value, rule.min, rule.max, rule.label);
            if (!validation.valid) errors[field] = validation.message;
        }

        if (rule.custom) {
            const validation = rule.custom(value);
            if (!validation.valid) errors[field] = validation.message;
        }
    });

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

export default {
    validateEmail,
    validatePhone,
    validatePassword,
    validateName,
    validateAge,
    validateDate,
    validateFutureDate,
    validateFile,
    validatePinCode,
    validateRequired,
    validateNumber,
    validateForm,
};
