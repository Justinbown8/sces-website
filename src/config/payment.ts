// Payment configuration and settings

export const PAYMENT_CONFIG = {
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    currency: 'INR',
    name: 'Sunrise Children Educational Society',
    description: 'Supporting children\'s education across India',
    theme: {
      color: '#3B82F6',
    },
    modal: {
      backdrop_close: false,
      escape: false,
      handleback: false,
      confirm_close: true,
    },
    retry: {
      enabled: true,
      max_count: 3,
    },
    timeout: 300, // 5 minutes
  },
  
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  },
  
  limits: {
    minAmount: 1, // ₹1
    maxAmount: 500000, // ₹5,00,000
    maxRetries: 3,
  },
  
  features: {
    recurringPayments: true,
    internationalPayments: true, // Enabled with PayPal
    walletPayments: true,
    upiPayments: true,
    cardPayments: true,
    netBankingPayments: true,
  },
} as const;

export const SUPPORTED_PAYMENT_METHODS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'UPI, Cards, Net Banking, Wallets',
    enabled: true,
    recommended: true,
    methods: ['upi', 'card', 'netbanking', 'wallet'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'International payments',
    enabled: true,
    recommended: false,
    methods: ['paypal', 'card'],
  },
] as const;

export const DONATION_PRESETS = [
  {
    amount: 500,
    label: 'School Kit',
    description: 'Provides basic school supplies for one child',
    impact: 'Helps 1 child get essential learning materials',
  },
  {
    amount: 1000,
    label: 'Tuition Support',
    description: 'One month of educational support',
    impact: 'Covers tuition fees for 1 child for 1 month',
  },
  {
    amount: 2500,
    label: 'Digital Access',
    description: 'Digital learning tools and resources',
    impact: 'Provides digital learning access for 1 child',
  },
  {
    amount: 5000,
    label: 'Full Sponsorship',
    description: 'Comprehensive educational support',
    impact: 'Complete educational support for 1 child for 3 months',
  },
] as const;

export const RECURRING_FREQUENCIES = [
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'Charged every month',
  },
  {
    value: 'quarterly',
    label: 'Quarterly',
    description: 'Charged every 3 months',
  },
  {
    value: 'yearly',
    label: 'Yearly',
    description: 'Charged every year',
  },
] as const;

// Validation rules
export const VALIDATION_RULES = {
  amount: {
    min: PAYMENT_CONFIG.limits.minAmount,
    max: PAYMENT_CONFIG.limits.maxAmount,
    required: true,
  },
  donor: {
    name: {
      minLength: 2,
      maxLength: 100,
      required: true,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: true,
    },
    phone: {
      pattern: /^[+]?[\d\s\-\(\)]{10,15}$/,
      required: false,
    },
  },
} as const;