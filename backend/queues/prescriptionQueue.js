import { getChannel } from '../config/rabbitmq.js';

const QUEUE_NAME = 'prescription_queue';

export const processPrescription = async (data) => {
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

        console.log('Prescription processing task sent to queue:', data.prescriptionId);
    } catch (error) {
        console.error('Error sending prescription to queue:', error);
        throw error;
    }
};
