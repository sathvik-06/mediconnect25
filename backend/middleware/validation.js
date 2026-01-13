import Joi from 'joi';

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'pharmacist', 'admin').required(),
    phone: Joi.string().pattern(/^\d{10}$/).optional(),
    dateOfBirth: Joi.date().max('now').optional(),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional()
  }).unknown(true); // Allow additional role-specific fields

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('patient', 'doctor', 'pharmacist', 'admin').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateAppointment = (req, res, next) => {
  const schema = Joi.object({
    doctorId: Joi.string().required(),
    date: Joi.date().min('now').required(),
    timeSlot: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    patientDetails: Joi.object({
      patientName: Joi.string().required(),
      patientAge: Joi.number().min(1).max(120).required(),
      patientGender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').required(),
      contactNumber: Joi.string().pattern(/^\d{10}$/).required(),
      symptoms: Joi.string().optional(),
      previousConditions: Joi.string().optional()
    }).required(),
    notes: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validatePrescription = (req, res, next) => {
  const schema = Joi.object({
    appointmentId: Joi.string().required(),
    diagnosis: Joi.string().required(),
    medicines: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        duration: Joi.string().required(),
        instructions: Joi.string().optional(),
        notes: Joi.string().optional()
      })
    ).min(1).required(),
    notes: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\d{10}$/).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

export const validateVerifyOTP = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\d{10}$/).required(),
    otp: Joi.string().length(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

export const validateResetPassword = (req, res, next) => {
  const schema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};