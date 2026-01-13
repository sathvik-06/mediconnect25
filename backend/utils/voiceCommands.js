export const voiceCommands = {
  greetings: [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'
  ],
  appointment: [
    'book appointment', 'schedule appointment', 'make appointment',
    'see doctor', 'meet doctor', 'consult doctor'
  ],
  search: [
    'find doctor', 'search doctor', 'look for doctor',
    'find cardiologist', 'search dermatologist', 'look for pediatrician'
  ],
  reminders: [
    'set reminder', 'medicine reminder', 'remind me',
    'take medicine', 'pill reminder'
  ],
  prescriptions: [
    'upload prescription', 'show prescriptions', 'my prescriptions'
  ],
  help: [
    'help', 'what can you do', 'how does this work', 'commands'
  ]
};

export const getCommandCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  for (const [category, commands] of Object.entries(voiceCommands)) {
    for (const command of commands) {
      if (lowerText.includes(command)) {
        return category;
      }
    }
  }
  
  return 'unknown';
};

export const extractParameters = (text, category) => {
  const params = {};
  const lowerText = text.toLowerCase();
  
  switch (category) {
    case 'appointment':
      // Extract date and time
      if (lowerText.includes('today')) params.date = 'today';
      else if (lowerText.includes('tomorrow')) params.date = 'tomorrow';
      else if (lowerText.includes('monday')) params.date = 'monday';
      // Add more date extraction logic
      
      if (lowerText.includes('morning')) params.time = 'morning';
      else if (lowerText.includes('afternoon')) params.time = 'afternoon';
      else if (lowerText.includes('evening')) params.time = 'evening';
      break;
      
    case 'search':
      // Extract specialty
      const specialties = ['cardiologist', 'dermatologist', 'neurologist', 'pediatrician'];
      for (const specialty of specialties) {
        if (lowerText.includes(specialty)) {
          params.specialty = specialty;
          break;
        }
      }
      break;
      
    case 'reminders':
      // Extract medicine name
      const medicines = ['paracetamol', 'ibuprofen', 'amoxicillin', 'insulin'];
      for (const medicine of medicines) {
        if (lowerText.includes(medicine)) {
          params.medicine = medicine;
          break;
        }
      }
      break;
  }
  
  return params;
};