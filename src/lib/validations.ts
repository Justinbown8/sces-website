// Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.push('Please enter a valid 10-digit Indian mobile number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateDonationAmount(amount: number): ValidationResult {
  const errors: string[] = [];
  
  if (!amount || amount <= 0) {
    errors.push('Please enter a valid donation amount');
  } else if (amount < 100) {
    errors.push('Minimum donation amount is ₹100');
  } else if (amount > 500000) {
    errors.push('Maximum donation amount is ₹5,00,000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateVolunteerName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Full name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 50) {
    errors.push('Name must be less than 50 characters');
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCity(city: string): ValidationResult {
  const errors: string[] = [];
  
  if (!city || city.trim().length === 0) {
    errors.push('City is required');
  } else if (city.trim().length < 2) {
    errors.push('City name must be at least 2 characters long');
  } else if (city.trim().length > 30) {
    errors.push('City name must be less than 30 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateAvailability(availability: string): ValidationResult {
  const errors: string[] = [];
  const validOptions = ['weekdays', 'weekends', 'evenings', 'flexible'];
  
  if (!availability) {
    errors.push('Please select your availability');
  } else if (!validOptions.includes(availability)) {
    errors.push('Please select a valid availability option');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateSkills(skills: string[]): ValidationResult {
  const errors: string[] = [];
  
  if (!skills || skills.length === 0) {
    errors.push('Please select at least one skill');
  } else if (skills.length > 5) {
    errors.push('Please select no more than 5 skills');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateMessage(message: string): ValidationResult {
  const errors: string[] = [];
  
  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  } else if (message.trim().length > 500) {
    errors.push('Message must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}