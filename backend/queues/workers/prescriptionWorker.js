import { connectRabbitMQ } from '../../config/rabbitmq.js';
import { processPrescriptionImage } from '../../services/prescriptionProcessingService.js';

const startPrescriptionWorker = async () => {
  try {
    const channel = await connectRabbitMQ();

    if (!channel) {
      console.log('RabbitMQ not available, skipping prescription worker start');
      return;
    }

    console.log('Prescription worker started...');

    channel.consume('prescription_processing', async (msg) => {
      if (msg !== null) {
        try {
          const { prescriptionId, fileUrl, patientId } = JSON.parse(msg.content.toString());

          console.log(`Processing prescription ${prescriptionId}`);

          await processPrescriptionImage(fileUrl, prescriptionId);

          channel.ack(msg);
          console.log(`Prescription ${prescriptionId} processed successfully`);
        } catch (error) {
          console.error('Error processing prescription:', error);
          // Move to dead letter queue after max retries
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('Prescription worker error:', error);
    process.exit(1);
  }
};

startPrescriptionWorker();