// Test script to manually queue a notification
import { getChannel } from './config/rabbitmq.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import 'dotenv/config';

const testQueue = async () => {
    try {
        console.log('Connecting to RabbitMQ...');
        await connectRabbitMQ();

        const channel = getChannel();
        if (!channel) {
            console.error('❌ Channel is null!');
            process.exit(1);
        }

        console.log('✅ Channel obtained');

        // Send test notification - using the one we fixed (patient_checked_in)
        const testNotif = {
            type: 'patient_checked_in',
            userId: '692f00cb1c7dbf8a8f600c3f',
            data: {
                patientName: 'Test Patient',
                time: '10:00 AM'
            }
        };

        console.log('Sending test notification to queue...');
        channel.sendToQueue('notification_queue', Buffer.from(JSON.stringify(testNotif)));
        console.log('✅ Message sent to queue!');

        // Wait a bit for worker to process
        console.log('Waiting 3 seconds for worker to process...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Done! Check database for notification.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testQueue();
