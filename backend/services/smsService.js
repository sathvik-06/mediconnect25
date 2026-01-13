import twilio from 'twilio';

let client;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✓ Twilio client initialized successfully');
  } else {
    console.warn('⚠️  Twilio credentials missing. SMS service will run in mock mode.');
  }
} catch (error) {
  console.warn('❌ Failed to initialize Twilio client:', error.message);
}

export const sendSMS = async (to, message) => {
  try {
    // Send real SMS if Twilio client is configured
    if (client) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      console.log(`✓ SMS sent to ${to}`);
      return { success: true, message: 'SMS sent successfully' };
    } else {
      // Mock mode when credentials are missing
      console.log(`[MOCK SMS] To: ${to}`);
      console.log(`[MOCK SMS] Message: ${message}`);
      console.warn('⚠️  Twilio not configured. SMS not sent. Add credentials to .env file.');
      return { success: false, message: 'SMS service not configured' };
    }
  } catch (error) {
    console.error('❌ SMS sending error:', error.message);
    if (error.code === 21608) {
      console.error('⚠️  The phone number is unverified. Verify it in Twilio Console for trial accounts.');
    }
    // In development, log error but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.error('SMS failed but continuing in development mode');
      return { success: false, message: error.message };
    }
    throw error;
  }
};

export const sendAppointmentReminder = async (phone, appointmentDetails) => {
  const message = `Reminder: Your appointment with Dr. ${appointmentDetails.doctorName} is tomorrow at ${appointmentDetails.time}. Please arrive 10 minutes early.`;
  return sendSMS(phone, message);
};

export const sendOTP = async (phone, otp) => {
  const message = `Your MediConnect verification code is: ${otp}. This code will expire in 10 minutes.`;
  return sendSMS(phone, message);
};