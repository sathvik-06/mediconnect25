// queues/workers/emailWorker.js
import { connectRabbitMQ } from '../../config/rabbitmq.js';
import { sendEmail } from '../../services/emailService.js';

export const startEmailWorker = async () => {
  try {
    const channel = await connectRabbitMQ();

    if (!channel) {
      console.log('RabbitMQ not available, skipping email worker start');
      return;
    }

    console.log('Email worker started...');

    channel.consume('email_queue', async (msg) => {
      if (msg !== null) {
        try {
          const { to, subject, template, data } = JSON.parse(msg.content.toString());

          await sendEmail(to, subject, template, data);

          channel.ack(msg);
          console.log(`Email sent to ${to}`);
        } catch (error) {
          console.error('Error processing email:', error);
          // Optionally: Implement retry logic or move to dead letter queue
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('Email worker error:', error);
  }
};

// Run if called directly
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startEmailWorker();
}