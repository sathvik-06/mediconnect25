import { connectRabbitMQ } from '../../config/rabbitmq.js';
import { processVoiceCommand } from '../../services/voiceProcessingService.js';

const startVoiceWorker = async () => {
  try {
    const channel = await connectRabbitMQ();

    if (!channel) {
      console.log('RabbitMQ not available, skipping voice worker start');
      return;
    }

    console.log('Voice worker started...');

    channel.consume('voice_processing', async (msg) => {
      if (msg !== null) {
        try {
          const { audioText, userId, sessionId } = JSON.parse(msg.content.toString());

          console.log(`Processing voice command from user ${userId}`);

          const response = await processVoiceCommand(audioText, userId);

          // Send response back via WebSocket or store in Redis
          // This would be handled by the main server

          channel.ack(msg);
          console.log(`Voice command processed for user ${userId}`);
        } catch (error) {
          console.error('Error processing voice command:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('Voice worker error:', error);
    process.exit(1);
  }
};

startVoiceWorker();