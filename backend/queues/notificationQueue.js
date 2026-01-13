import { getChannel } from '../config/rabbitmq.js';

const QUEUE_NAME = 'notification_queue';

export const sendNotification = async (data) => {
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

        console.log('Notification task sent to queue:', data.userId);
    } catch (error) {
        console.error('Error sending notification to queue:', error);
        throw error;
    }
};
