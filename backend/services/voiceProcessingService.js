export const processVoiceCommand = async (audioText, userId) => {
  try {
    const command = audioText.toLowerCase();
    let response = {
      type: 'unknown',
      data: {},
      message: "I'm not sure how to help with that. Try saying 'find doctors' or 'book appointment'."
    };

    // Doctor search commands
    if (command.includes('find') || command.includes('search') || command.includes('look for')) {
      const specialty = extractSpecialty(command);
      response = {
        type: 'search_doctors',
        data: {
          searchQuery: command,
          specialty
        },
        message: `Searching for ${specialty || 'doctors'}...`
      };
    }
    
    // Appointment booking commands
    else if (command.includes('book') || command.includes('schedule') || command.includes('appointment')) {
      const { date, time } = extractDateTime(command);
      response = {
        type: 'book_appointment',
        data: {
          date,
          time
        },
        message: `Booking appointment for ${date || 'soon'}...`
      };
    }
    
    // Medicine reminders
    else if (command.includes('remind') || command.includes('medicine') || command.includes('pill')) {
      const medicine = extractMedicine(command);
      response = {
        type: 'set_reminder',
        data: {
          medicineName: medicine
        },
        message: `Setting reminder for ${medicine || 'your medicine'}...`
      };
    }
    
    // General help
    else if (command.includes('help') || command.includes('what can you do')) {
      response = {
        type: 'help',
        data: {},
        message: 'I can help you find doctors, book appointments, set medicine reminders, and search for medical services. Try saying "find a cardiologist" or "book appointment tomorrow".'
      };
    }

    return response;
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
};

const extractSpecialty = (command) => {
  const specialties = {
    'cardiologist': 'cardiology',
    'dermatologist': 'dermatology',
    'neurologist': 'neurology',
    'pediatrician': 'pediatrics',
    'orthopedic': 'orthopedics',
    'gynecologist': 'gynecology',
    'psychiatrist': 'psychiatry',
    'dentist': 'dentistry'
  };

  for (const [keyword, specialty] of Object.entries(specialties)) {
    if (command.includes(keyword)) {
      return specialty;
    }
  }

  return null;
};

const extractDateTime = (command) => {
  const dateTime = {
    date: null,
    time: null
  };

  // Extract date keywords
  const dateKeywords = {
    'today': 0,
    'tomorrow': 1,
    'monday': getNextDay(1),
    'tuesday': getNextDay(2),
    'wednesday': getNextDay(3),
    'thursday': getNextDay(4),
    'friday': getNextDay(5),
    'saturday': getNextDay(6),
    'sunday': getNextDay(0)
  };

  // Extract time keywords
  const timeKeywords = {
    'morning': '09:00',
    'afternoon': '14:00',
    'evening': '17:00',
    'night': '20:00'
  };

  for (const [keyword, days] of Object.entries(dateKeywords)) {
    if (command.includes(keyword)) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      dateTime.date = date.toISOString().split('T')[0];
      break;
    }
  }

  for (const [keyword, time] of Object.entries(timeKeywords)) {
    if (command.includes(keyword)) {
      dateTime.time = time;
      break;
    }
  }

  return dateTime;
};

const extractMedicine = (command) => {
  const medicines = [
    'paracetamol', 'ibuprofen', 'amoxicillin', 'aspirin', 'metformin',
    'atorvastatin', 'losartan', 'metoprolol', 'omeprazole', 'insulin'
  ];

  for (const medicine of medicines) {
    if (command.includes(medicine)) {
      return medicine;
    }
  }

  return null;
};

const getNextDay = (targetDay) => {
  const today = new Date().getDay();
  let daysToAdd = targetDay - today;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  return daysToAdd;
};