import { getChannel } from '../config/rabbitmq.js';

const QUEUE_NAME = 'voice_queue';

export const processVoiceCommand = async (data) => {
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

        console.log('Voice command task sent to queue');
    } catch (error) {
        console.error('Error sending voice command to queue:', error);
        throw error;
    }
};
