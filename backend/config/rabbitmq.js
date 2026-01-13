// config/rabbitmq.js
import amqp from 'amqplib';

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  if (connection && channel) {
    return channel;
  }

  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.warn('RabbitMQ connection closed');
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();

    // Declare queues
    await channel.assertQueue('email_queue', { durable: true });
    await channel.assertQueue('notification_queue', { durable: true });
    await channel.assertQueue('prescription_processing', { durable: true });
    await channel.assertQueue('voice_processing', { durable: true });

    console.log('RabbitMQ Connected');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error (continuing without RabbitMQ):', error.message);
    // Return null instead of throwing to allow server to start
    return null;
  }
};

const getChannel = () => channel;

const publishToQueue = async (queue, data) => {
  if (!channel) {
    console.warn(`RabbitMQ channel not available. Cannot publish to ${queue}`);
    return false;
  }
  try {
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
  } catch (error) {
    console.error(`Error publishing to ${queue}:`, error);
    return false;
  }
};

export { connectRabbitMQ, getChannel, publishToQueue };