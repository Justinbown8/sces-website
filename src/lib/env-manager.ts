// Environment variable management utilities

export interface EnvironmentConfig {
  // Payment configuration
  NEXT_PUBLIC_RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  
  // Social media URLs
  NEXT_PUBLIC_FACEBOOK_URL?: string;
  NEXT_PUBLIC_INSTAGRAM_URL?: string;
  NEXT_PUBLIC_TWITTER_URL?: string;
  NEXT_PUBLIC_LINKEDIN_URL?: string;
  NEXT_PUBLIC_YOUTUBE_URL?: string;
  
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID?: string;
  NEXT_PUBLIC_HOTJAR_SITE_ID?: string;
  
  // Security
  CSRF_SECRET?: string;
  NEXTAUTH_SECRET?: string;
  
  // Email configuration
  EMAIL_FROM?: string;
  EMAIL_SMTP_HOST?: string;
  EMAIL_SMTP_PORT?: string;
  EMAIL_SMTP_USER?: string;
  EMAIL_SMTP_PASSWORD?: string;
  
  // Site configuration
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SITE_NAME?: string;
  
  // Development
  NODE_ENV?: 'development' | 'production' | 'test';
}

// Environment variable validation
export const requiredEnvVars = {
  production: [
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'CSRF_SECRET',
    'NEXT_PUBLIC_SITE_URL'
  ],
  development: [
    'CSRF_SECRET'
  ]
} as const;

export const optionalEnvVars = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_FACEBOOK_PIXEL_ID',
  'NEXT_PUBLIC_HOTJAR_SITE_ID',
  'NEXT_PUBLIC_FACEBOOK_URL',
  'NEXT_PUBLIC_INSTAGRAM_URL',
  'NEXT_PUBLIC_TWITTER_URL',
  'NEXT_PUBLIC_LINKEDIN_URL',
  'NEXT_PUBLIC_YOUTUBE_URL',
  'EMAIL_FROM',
  'EMAIL_SMTP_HOST',
  'EMAIL_SMTP_PORT',
  'EMAIL_SMTP_USER',
  'EMAIL_SMTP_PASSWORD',
  'RAZORPAY_WEBHOOK_SECRET',
  'NEXTAUTH_SECRET'
] as const;

// Environment variable getter with type safety
export function getEnvVar(key: keyof EnvironmentConfig): string | undefined {
  return process.env[key];
}

// Required environment variable getter (throws if missing)
export function getRequiredEnvVar(key: keyof EnvironmentConfig): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

// Environment variable getter with default value
export function getEnvVarWithDefault(key: keyof EnvironmentConfig, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

// Boolean environment variable getter
export function getBooleanEnvVar(key: keyof EnvironmentConfig, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// Number environment variable getter
export function getNumberEnvVar(key: keyof EnvironmentConfig, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
  }
  return parsed;
}

// Validate environment variables
export function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env as keyof typeof requiredEnvVars] || [];
  
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // Check optional but recommended variables
  if (env === 'production') {
    if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      warnings.push('NEXT_PUBLIC_GA_MEASUREMENT_ID is not set - analytics will be disabled');
    }
    
    if (!process.env.EMAIL_SMTP_HOST) {
      warnings.push('Email SMTP configuration is not set - email notifications will be disabled');
    }
    
    if (!process.env.NEXT_PUBLIC_FACEBOOK_URL) {
      warnings.push('NEXT_PUBLIC_FACEBOOK_URL is not set - Facebook link will use placeholder');
    }
    
    if (!process.env.NEXT_PUBLIC_INSTAGRAM_URL) {
      warnings.push('NEXT_PUBLIC_INSTAGRAM_URL is not set - Instagram link will use placeholder');
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

// Generate .env.example content
export function generateEnvExample(): string {
  const lines = [
    '# SCES NGO Website Environment Variables',
    '# Copy this file to .env.local and fill in your actual values',
    '',
    '# Site Configuration',
    'NEXT_PUBLIC_SITE_URL=https://your-domain.com',
    'NEXT_PUBLIC_SITE_NAME="Sunrise Children Educational Society"',
    '',
    '# Payment Configuration',
    '# Razorpay (Primary payment method)',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id',
    'RAZORPAY_KEY_SECRET=your_razorpay_key_secret',
    'RAZORPAY_WEBHOOK_SECRET=your_webhook_secret',
    '',
    '# PayPal (Secondary payment method)',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id',
    'PAYPAL_CLIENT_SECRET=your_paypal_client_secret',
    '',
    '# Social Media URLs',
    'NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/your-page',
    'NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-account',
    'NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-account',
    'NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/your-company',
    'NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/channel/your-channel',
    '',
    '# Analytics',
    'NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX',
    'NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_pixel_id',
    'NEXT_PUBLIC_HOTJAR_SITE_ID=your_hotjar_site_id',
    '',
    '# Email Configuration (for notifications)',
    'EMAIL_FROM=noreply@your-domain.com',
    'EMAIL_SMTP_HOST=smtp.your-provider.com',
    'EMAIL_SMTP_PORT=587',
    'EMAIL_SMTP_USER=your_smtp_username',
    'EMAIL_SMTP_PASSWORD=your_smtp_password',
    '',
    '# Security',
    'CSRF_SECRET=your_csrf_secret_key_change_in_production',
    'NEXTAUTH_SECRET=your_nextauth_secret_for_authentication',
    '',
    '# Development',
    'NODE_ENV=development'
  ];
  
  return lines.join('\n');
}

// Environment configuration object
export const envConfig: EnvironmentConfig = {
  // Payment
  NEXT_PUBLIC_RAZORPAY_KEY_ID: getEnvVar('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: getEnvVar('RAZORPAY_KEY_SECRET'),
  RAZORPAY_WEBHOOK_SECRET: getEnvVar('RAZORPAY_WEBHOOK_SECRET'),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: getEnvVar('NEXT_PUBLIC_PAYPAL_CLIENT_ID'),
  PAYPAL_CLIENT_SECRET: getEnvVar('PAYPAL_CLIENT_SECRET'),
  
  // Social
  NEXT_PUBLIC_FACEBOOK_URL: getEnvVar('NEXT_PUBLIC_FACEBOOK_URL'),
  NEXT_PUBLIC_INSTAGRAM_URL: getEnvVar('NEXT_PUBLIC_INSTAGRAM_URL'),
  NEXT_PUBLIC_TWITTER_URL: getEnvVar('NEXT_PUBLIC_TWITTER_URL'),
  NEXT_PUBLIC_LINKEDIN_URL: getEnvVar('NEXT_PUBLIC_LINKEDIN_URL'),
  NEXT_PUBLIC_YOUTUBE_URL: getEnvVar('NEXT_PUBLIC_YOUTUBE_URL'),
  
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID: getEnvVar('NEXT_PUBLIC_FACEBOOK_PIXEL_ID'),
  NEXT_PUBLIC_HOTJAR_SITE_ID: getEnvVar('NEXT_PUBLIC_HOTJAR_SITE_ID'),
  
  // Security
  CSRF_SECRET: getEnvVar('CSRF_SECRET'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  
  // Email
  EMAIL_FROM: getEnvVar('EMAIL_FROM'),
  EMAIL_SMTP_HOST: getEnvVar('EMAIL_SMTP_HOST'),
  EMAIL_SMTP_PORT: getEnvVar('EMAIL_SMTP_PORT'),
  EMAIL_SMTP_USER: getEnvVar('EMAIL_SMTP_USER'),
  EMAIL_SMTP_PASSWORD: getEnvVar('EMAIL_SMTP_PASSWORD'),
  
  // Site
  NEXT_PUBLIC_SITE_URL: getEnvVar('NEXT_PUBLIC_SITE_URL'),
  NEXT_PUBLIC_SITE_NAME: getEnvVar('NEXT_PUBLIC_SITE_NAME'),
  
  // Development
  NODE_ENV: (getEnvVar('NODE_ENV') as 'development' | 'production' | 'test') || 'development'
};

// Utility to check if we're in production
export const isProduction = () => envConfig.NODE_ENV === 'production';

// Utility to check if we're in development
export const isDevelopment = () => envConfig.NODE_ENV === 'development';

// Utility to check if we're in test mode
export const isTest = () => envConfig.NODE_ENV === 'test';

// Log environment validation on startup (only in development)
if (isDevelopment()) {
  const validation = validateEnvironmentVariables();
  
  if (!validation.isValid) {
    console.warn('⚠️  Missing required environment variables:', validation.missing);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️  Environment warnings:', validation.warnings);
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ Environment variables validated successfully');
  }
}

export default envConfig;