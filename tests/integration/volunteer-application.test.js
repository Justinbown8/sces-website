/**
 * Integration Tests for Volunteer Application Process
 * Tests the complete volunteer application submission flow
 */

const { JSDOM } = require('jsdom');

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('Volunteer Application Integration Tests', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Validation', () => {
    test('should validate required fields', async () => {
      const applicationData = {
        personalInfo: {
          name: '',
          email: '',
          phone: ''
        },
        city: '',
        availability: '',
        skills: [],
        message: ''
      };

      const validation = validateVolunteerForm(applicationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.name).toBeDefined();
      expect(validation.errors.email).toBeDefined();
      expect(validation.errors.phone).toBeDefined();
      expect(validation.errors.city).toBeDefined();
      expect(validation.errors.availability).toBeDefined();
    });

    test('should validate email format', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'invalid-email',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      const validation = validateVolunteerForm(applicationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.email).toContain('valid email');
    });

    test('should validate phone number format', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123' // Invalid phone
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      const validation = validateVolunteerForm(applicationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.phone).toContain('10-digit');
    });

    test('should pass validation with valid data', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching', 'mentoring'],
        message: 'I want to help children with their education'
      };

      const validation = validateVolunteerForm(applicationData);
      expect(validation.isValid).toBe(true);
      expect(Object.keys(validation.errors)).toHaveLength(0);
    });
  });

  describe('Application Submission', () => {
    test('should submit application successfully', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          applicationId: 'app_123',
          message: 'Application submitted successfully'
        })
      });

      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.applicationId).toBeDefined();
    });

    test('should handle spam protection', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help',
        honeypot: 'spam-value' // This should trigger spam protection
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Spam detected'
        })
      });

      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      expect(response.ok).toBe(false);
      const error = await response.json();
      expect(error.error).toBe('Spam detected');
    });

    test('should handle server errors gracefully', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Internal server error'
        })
      });

      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('Rate Limiting', () => {
    test('should handle rate limiting', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many requests. Please try again later.'
        })
      });

      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      expect(response.status).toBe(429);
      const error = await response.json();
      expect(error.error).toContain('Too many requests');
    });
  });

  describe('Email Notifications', () => {
    test('should trigger email notification on successful submission', async () => {
      const applicationData = {
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        city: 'Delhi',
        availability: 'weekends',
        skills: ['teaching'],
        message: 'I want to help'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          applicationId: 'app_123',
          emailSent: true
        })
      });

      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
    });
  });
});

// Helper function for volunteer form validation
function validateVolunteerForm(data) {
  const errors = {};
  let isValid = true;

  // Validate name
  if (!data.personalInfo.name || data.personalInfo.name.trim() === '') {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.personalInfo.email || !emailRegex.test(data.personalInfo.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.personalInfo.phone || !phoneRegex.test(data.personalInfo.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number';
    isValid = false;
  }

  // Validate city
  if (!data.city || data.city.trim() === '') {
    errors.city = 'City is required';
    isValid = false;
  }

  // Validate availability
  if (!data.availability || data.availability.trim() === '') {
    errors.availability = 'Availability is required';
    isValid = false;
  }

  // Validate skills (optional but should be array)
  if (data.skills && !Array.isArray(data.skills)) {
    errors.skills = 'Skills should be an array';
    isValid = false;
  }

  return { isValid, errors };
}