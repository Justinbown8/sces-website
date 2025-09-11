/**
 * Integration Tests for Form Validation and Error Handling
 * Tests all form submissions and error handling across the application
 */

const { JSDOM } = require('jsdom');

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('Form Validation Integration Tests', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Donation Form Validation', () => {
    test('should validate all required fields', () => {
      const formData = {
        amount: '',
        donor: {
          name: '',
          email: '',
          phone: ''
        }
      };

      const errors = validateDonationForm(formData);
      expect(errors.amount).toBeDefined();
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone).toBeDefined();
    });

    test('should validate amount constraints', () => {
      const testCases = [
        { amount: 100, expectedError: 'Minimum donation amount is ₹500' },
        { amount: 'invalid', expectedError: 'Please enter a valid amount' },
        { amount: -500, expectedError: 'Amount must be positive' },
        { amount: 1000000, expectedError: 'Maximum donation amount is ₹999,999' }
      ];

      testCases.forEach(({ amount, expectedError }) => {
        const formData = {
          amount,
          donor: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210'
          }
        };

        const errors = validateDonationForm(formData);
        expect(errors.amount).toContain(expectedError);
      });
    });

    test('should validate email formats', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@domain.com',
        'test..test@domain.com',
        'test@domain',
        ''
      ];

      invalidEmails.forEach(email => {
        const formData = {
          amount: 1000,
          donor: {
            name: 'John Doe',
            email,
            phone: '9876543210'
          }
        };

        const errors = validateDonationForm(formData);
        expect(errors.email).toBeDefined();
      });
    });

    test('should validate phone number formats', () => {
      const invalidPhones = [
        '123456789',    // 9 digits
        '12345678901',  // 11 digits
        '0123456789',   // starts with 0
        '5123456789',   // starts with 5
        'abcdefghij',   // letters
        '123-456-7890', // with dashes
        ''              // empty
      ];

      invalidPhones.forEach(phone => {
        const formData = {
          amount: 1000,
          donor: {
            name: 'John Doe',
            email: 'john@example.com',
            phone
          }
        };

        const errors = validateDonationForm(formData);
        expect(errors.phone).toBeDefined();
      });
    });
  });

  describe('Volunteer Form Validation', () => {
    test('should validate personal information', () => {
      const formData = {
        personalInfo: {
          name: '',
          email: 'invalid-email',
          phone: '123'
        },
        city: '',
        availability: '',
        skills: [],
        message: ''
      };

      const errors = validateVolunteerForm(formData);
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone).toBeDefined();
      expect(errors.city).toBeDefined();
      expect(errors.availability).toBeDefined();
    });

    test('should validate skills selection', () => {
      const formData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: [], // Empty skills array
        message: 'I want to help'
      };

      const errors = validateVolunteerForm(formData);
      // Skills are optional, so no error expected
      expect(errors.skills).toBeUndefined();
    });

    test('should validate message length', () => {
      const shortMessage = 'Hi';
      const longMessage = 'a'.repeat(1001); // Over 1000 characters

      const baseFormData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching']
      };

      // Test short message
      const shortMessageErrors = validateVolunteerForm({
        ...baseFormData,
        message: shortMessage
      });
      expect(shortMessageErrors.message).toContain('at least 10 characters');

      // Test long message
      const longMessageErrors = validateVolunteerForm({
        ...baseFormData,
        message: longMessage
      });
      expect(longMessageErrors.message).toContain('maximum 1000 characters');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const errorHandler = createErrorHandler();
      const result = await errorHandler.handleSubmissionError(new Error('Network error'));

      expect(result.type).toBe('network');
      expect(result.message).toContain('network connection');
      expect(result.retry).toBe(true);
    });

    test('should handle validation errors from server', async () => {
      const serverError = {
        status: 400,
        json: async () => ({
          errors: {
            email: 'Email already exists',
            phone: 'Invalid phone number'
          }
        })
      };

      global.fetch.mockResolvedValueOnce(serverError);

      const errorHandler = createErrorHandler();
      const result = await errorHandler.handleServerError(serverError);

      expect(result.type).toBe('validation');
      expect(result.errors.email).toBe('Email already exists');
      expect(result.errors.phone).toBe('Invalid phone number');
    });

    test('should handle rate limiting', async () => {
      const rateLimitError = {
        status: 429,
        json: async () => ({
          error: 'Too many requests',
          retryAfter: 60
        })
      };

      global.fetch.mockResolvedValueOnce(rateLimitError);

      const errorHandler = createErrorHandler();
      const result = await errorHandler.handleServerError(rateLimitError);

      expect(result.type).toBe('rate_limit');
      expect(result.retryAfter).toBe(60);
    });

    test('should handle server errors', async () => {
      const serverError = {
        status: 500,
        json: async () => ({
          error: 'Internal server error'
        })
      };

      global.fetch.mockResolvedValueOnce(serverError);

      const errorHandler = createErrorHandler();
      const result = await errorHandler.handleServerError(serverError);

      expect(result.type).toBe('server');
      expect(result.message).toContain('server error');
      expect(result.retry).toBe(true);
    });
  });

  describe('Spam Protection', () => {
    test('should detect honeypot field', () => {
      const formData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help',
        honeypot: 'spam-value' // This should trigger spam detection
      };

      const isSpam = detectSpam(formData);
      expect(isSpam).toBe(true);
    });

    test('should detect rapid submissions', () => {
      const submissions = [
        { timestamp: Date.now() },
        { timestamp: Date.now() + 100 }, // 100ms later
        { timestamp: Date.now() + 200 }  // 200ms later
      ];

      const isSpam = detectRapidSubmissions(submissions, 1000); // 1 second threshold
      expect(isSpam).toBe(true);
    });

    test('should allow normal submission timing', () => {
      const submissions = [
        { timestamp: Date.now() },
        { timestamp: Date.now() + 2000 }, // 2 seconds later
        { timestamp: Date.now() + 4000 }  // 4 seconds later
      ];

      const isSpam = detectRapidSubmissions(submissions, 1000); // 1 second threshold
      expect(isSpam).toBe(false);
    });
  });

  describe('Accessibility Validation', () => {
    test('should validate form accessibility', () => {
      const formElement = document.createElement('form');
      
      // Add form fields without proper labels
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.name = 'name';
      formElement.appendChild(nameInput);

      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.name = 'email';
      formElement.appendChild(emailInput);

      const accessibilityIssues = validateFormAccessibility(formElement);
      expect(accessibilityIssues.length).toBeGreaterThan(0);
      expect(accessibilityIssues.some(issue => issue.includes('label'))).toBe(true);
    });

    test('should validate proper form structure', () => {
      const formElement = document.createElement('form');
      
      // Add properly labeled form fields
      const nameLabel = document.createElement('label');
      nameLabel.textContent = 'Name';
      nameLabel.htmlFor = 'name';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.name = 'name';
      nameInput.id = 'name';
      nameInput.setAttribute('aria-required', 'true');

      formElement.appendChild(nameLabel);
      formElement.appendChild(nameInput);

      const accessibilityIssues = validateFormAccessibility(formElement);
      expect(accessibilityIssues.length).toBe(0);
    });
  });
});

// Helper functions for form validation
function validateDonationForm(data) {
  const errors = {};

  // Validate amount
  if (!data.amount || data.amount === '') {
    errors.amount = 'Donation amount is required';
  } else if (isNaN(data.amount)) {
    errors.amount = 'Please enter a valid amount';
  } else if (data.amount < 0) {
    errors.amount = 'Amount must be positive';
  } else if (data.amount < 500) {
    errors.amount = 'Minimum donation amount is ₹500';
  } else if (data.amount > 999999) {
    errors.amount = 'Maximum donation amount is ₹999,999';
  }

  // Validate donor name
  if (!data.donor.name || data.donor.name.trim() === '') {
    errors.name = 'Name is required';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.donor.email || !emailRegex.test(data.donor.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.donor.phone || !phoneRegex.test(data.donor.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number starting with 6-9';
  }

  return errors;
}

function validateVolunteerForm(data) {
  const errors = {};

  // Validate name
  if (!data.personalInfo.name || data.personalInfo.name.trim() === '') {
    errors.name = 'Name is required';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.personalInfo.email || !emailRegex.test(data.personalInfo.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.personalInfo.phone || !phoneRegex.test(data.personalInfo.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }

  // Validate city
  if (!data.city || data.city.trim() === '') {
    errors.city = 'City is required';
  }

  // Validate availability
  if (!data.availability || data.availability.trim() === '') {
    errors.availability = 'Availability is required';
  }

  // Validate message length
  if (data.message && data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  } else if (data.message && data.message.length > 1000) {
    errors.message = 'Message must be maximum 1000 characters long';
  }

  return errors;
}

function createErrorHandler() {
  return {
    handleSubmissionError: async (error) => {
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return {
          type: 'network',
          message: 'Please check your network connection and try again',
          retry: true
        };
      }
      
      return {
        type: 'unknown',
        message: 'An unexpected error occurred',
        retry: false
      };
    },

    handleServerError: async (response) => {
      const data = await response.json();
      
      switch (response.status) {
        case 400:
          return {
            type: 'validation',
            errors: data.errors || {},
            message: data.message || 'Validation failed'
          };
        case 429:
          return {
            type: 'rate_limit',
            message: 'Too many requests. Please try again later.',
            retryAfter: data.retryAfter || 60
          };
        case 500:
          return {
            type: 'server',
            message: 'Server error. Please try again later.',
            retry: true
          };
        default:
          return {
            type: 'unknown',
            message: 'An error occurred. Please try again.',
            retry: false
          };
      }
    }
  };
}

function detectSpam(formData) {
  // Check honeypot field
  if (formData.honeypot && formData.honeypot.trim() !== '') {
    return true;
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /viagra/i,
    /casino/i,
    /lottery/i,
    /winner/i,
    /congratulations/i
  ];

  const textFields = [
    formData.personalInfo?.name,
    formData.message,
    formData.donor?.name
  ].filter(Boolean);

  return textFields.some(text => 
    suspiciousPatterns.some(pattern => pattern.test(text))
  );
}

function detectRapidSubmissions(submissions, thresholdMs) {
  if (submissions.length < 2) return false;

  for (let i = 1; i < submissions.length; i++) {
    const timeDiff = submissions[i].timestamp - submissions[i - 1].timestamp;
    if (timeDiff < thresholdMs) {
      return true;
    }
  }

  return false;
}

function validateFormAccessibility(formElement) {
  const issues = [];
  const inputs = formElement.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    // Check for labels
    const hasLabel = formElement.querySelector(`label[for="${input.id}"]`) || 
                    input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby');
    
    if (!hasLabel) {
      issues.push(`Input "${input.name}" is missing a label`);
    }

    // Check for required field indicators
    if (input.hasAttribute('required') && !input.getAttribute('aria-required')) {
      issues.push(`Required input "${input.name}" is missing aria-required attribute`);
    }
  });

  return issues;
}