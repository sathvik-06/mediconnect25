import Tesseract from 'tesseract.js';
import Prescription from '../models/Prescription.js';

export const processPrescriptionImage = async (imageUrl, prescriptionId) => {
  try {
    console.log(`Processing prescription image: ${imageUrl}`);
    
    // In a real implementation, you would use OCR to extract text
    // For now, we'll simulate the processing
    
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      { logger: m => console.log(m) }
    );

    // Extract medicine names from text (simplified)
    const medicinesDetected = extractMedicinesFromText(text);
    
    // Update prescription with detected medicines
    await Prescription.findByIdAndUpdate(prescriptionId, {
      medicinesDetected,
      status: 'pending' // Change to pending for pharmacist validation
    });

    console.log(`Prescription ${prescriptionId} processed successfully`);
    
    return medicinesDetected;
  } catch (error) {
    console.error('Error processing prescription image:', error);
    
    // Mark as failed but keep in pending for manual processing
    await Prescription.findByIdAndUpdate(prescriptionId, {
      status: 'pending'
    });
    
    throw error;
  }
};

const extractMedicinesFromText = (text) => {
  // This is a simplified implementation
  // In production, you would use more sophisticated NLP techniques
  
  const commonMedicines = [
    'paracetamol', 'ibuprofen', 'amoxicillin', 'aspirin', 'metformin',
    'atorvastatin', 'losartan', 'metoprolol', 'omeprazole', 'levothyroxine',
    'albuterol', 'insulin', 'warfarin', 'prednisone', 'ciprofloxacin'
  ];

  const detected = [];
  const words = text.toLowerCase().split(/\s+/);

  commonMedicines.forEach(medicine => {
    if (words.includes(medicine) || text.toLowerCase().includes(medicine)) {
      detected.push({
        name: medicine,
        confidence: 0.8 // Simulated confidence score
      });
    }
  });

  return detected;
};

export const validatePrescriptionWithPharmacist = async (prescriptionId, pharmacistId, validationNotes) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      {
        validatedBy: pharmacistId,
        validationNotes,
        status: 'approved'
      },
      { new: true }
    ).populate('patient', 'name email');

    // Send notification to patient
    // This would be handled by the notification service

    return prescription;
  } catch (error) {
    console.error('Error validating prescription:', error);
    throw error;
  }
};