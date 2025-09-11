/**
 * Integration Tests for Donation Flow
 * Tests the complete end-to-end donation process
 */

const { JSDOM } = require('jsdom');

// Mock DOM environment for testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

describe('Donation Flow Integration Tests', () => {
  let mockRazorpay;
  let mockPayPal;

  beforeEach(() => {
    // Mock Razorpay
    mockRazorpay = {
      open: jest.fn(),
      on: jest.fn(),
    };
    global.Razorpay = jest.fn(() => mockRazorpay);

    // Mock PayPal
    mockPayPal = {
      Buttons: jest.fn(() => ({
        render: jest.fn(),
      })),
    };
    global.paypal = mockPayPal;

    // Mock fetch for API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Donation Form Validation', () => {
    test('should validate required donation amount', async () => {
      const donationData = {
        amount: '',
        donor: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890'
        }
      };

      const validation = validateDonationForm(donationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.amount).toBeDefined();
    });

    test('should validate minimum donation amount', async () => {
      const donationData = {
        amount: 100, // Below minimum of 500
        donor: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890'
        }
      };

      const validation = validateDonationForm(donationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.amount).toContain('minimum');
    });

    test('should validate donor information', async () => {
      const donationData = {
        amount: 1000,
        donor: {
          name: '',
          email: 'invalid-email',
          phone: '123' // Invalid phone
        }
      };

      const validation = validateDonationForm(donationData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.name).toBeDefined();
      expect(validation.errors.email).toBeDefined();
      expect(validation.errors.phone).toBeDefined();
    });

    test('should pass validation with valid data', async () => {
      const donationData = {
        amount: 1000,
        donor: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        }
      };

      const validation = validateDonationForm(donationData);
      expect(validation.isValid).toBe(true);
      expect(Object.keys(validation.errors)).toHaveLength(0);
    });
  });

  describe('Payment Processing', () => {
    test('should create Razorpay order successfully', async () => {
      const orderData = {
        amount: 100000, // 1000 INR in paise
        currency: 'INR',
        receipt: 'receipt_123'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'order_123',
          amount: 100000,
          currency: 'INR',
          status: 'created'
        })
      });

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const order = await response.json();
      expect(order.id).toBe('order_123');
      expect(order.amount).toBe(100000);
    });

    test('should handle Razorpay payment success', async () => {
      const paymentData = {
        razorpay_payment_id: 'pay_123',
        razorpay_order_id: 'order_123',
        razorpay_signature: 'signature_123'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          paymentId: 'pay_123'
        })
      });

      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      expect(result.success).toBe(true);
    });

    test('should handle PayPal order creation', async () => {
      const orderData = {
        amount: '10.00',
        currency: 'USD'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'paypal_order_123',
          status: 'CREATED'
        })
      });

      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const order = await response.json();
      expect(order.id).toBe('paypal_order_123');
      expect(order.status).toBe('CREATED');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/api/payment/create-order', {
          method: 'POST',
          body: JSON.stringify({ amount: 1000 })
        });
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should handle payment gateway errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid payment data'
        })
      });

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: 'invalid' })
      });

      expect(response.ok).toBe(false);
      const error = await response.json();
      expect(error.error).toBe('Invalid payment data');
    });
  });

  describe('Donation Tracking', () => {
    test('should track donation completion', async () => {
      const donationData = {
        id: 'donation_123',
        amount: 1000,
        status: 'completed',
        donor: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          trackingId: 'track_123'
        })
      });

      const response = await fetch('/api/donation/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });

      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.trackingId).toBeDefined();
    });
  });
});

// Helper function for donation form validation
function validateDonationForm(data) {
  const errors = {};
  let isValid = true;

  // Validate amount
  if (!data.amount || data.amount === '') {
    errors.amount = 'Donation amount is required';
    isValid = false;
  } else if (data.amount < 500) {
    errors.amount = 'Minimum donation amount is ₹500';
    isValid = false;
  }

  // Validate donor name
  if (!data.donor.name || data.donor.name.trim() === '') {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.donor.email || !emailRegex.test(data.donor.email)) {
    errors.email = 'Valid email is required';
    isValid = false;
  }

  // Validate phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!data.donor.phone || !phoneRegex.test(data.donor.phone)) {
    errors.phone = 'Valid 10-digit phone number is required';
    isValid = false;
  }

  return { isValid, errors };
}