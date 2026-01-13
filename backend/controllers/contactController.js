import { publishToQueue } from '../config/rabbitmq.js';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create email payload
        const emailData = {
            to: process.env.EMAIL_USER, // Send to admin (using system email for now)
            subject: `New Contact Us Message: ${subject}`,
            template: 'contact_us',
            data: {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toLocaleString()
            }
        };

        // Publish to email queue
        await publishToQueue('email_queue', emailData);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
