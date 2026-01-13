import { getChannel } from '../config/rabbitmq.js';

const QUEUE_NAME = 'email_queue';

export const sendEmail = async (data) => {
    try {
        const channel = getChannel();
        if (!channel) {
            console.error('RabbitMQ channel not available');
            return;
        }

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), {
            persistent: true
        });

        console.log('Email task sent to queue:', data.to);
    } catch (error) {
        console.error('Error sending email to queue:', error);
        throw error;
    }
};
