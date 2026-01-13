import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  // Add other services if needed
  return null;
};

export const sendEmail = async (to, subject, template, data) => {
  // Check if email is configured (basic check)
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('Email configuration missing or default. Skipping email send.');
    console.log('Would have sent:', { to, subject, template, data });
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.error('Email transporter could not be created');
    return;
  }

  try {
    let htmlContent = '';

    // Simple template logic
    if (template === 'contact_us') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Us Message</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Time:</strong> ${data.timestamp}</p>
          <hr/>
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `;
    } else {
      // Default fallback
      htmlContent = `<p>${JSON.stringify(data)}</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      replyTo: data.email, // Allow replying to the patient directly
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};