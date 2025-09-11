import { NextRequest, NextResponse } from 'next/server';
import { validateVolunteerName, validateEmail, validatePhone, validateCity, validateAvailability, validateSkills, validateMessage } from '@/lib/validations';
import type { VolunteerApplication } from '@/types';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Honeypot field name (should be hidden in the form)
const HONEYPOT_FIELD = 'website_url';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 applications per 15 minutes per IP

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const key = `volunteer_${ip}`;
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: record.resetTime };
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  
  return { allowed: true };
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

function validateCSRFToken(request: NextRequest): boolean {
  // In a real application, implement proper CSRF token validation
  // For now, we'll check for a custom header that should be set by the client
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Basic origin validation
  if (!origin && !referer) {
    return false;
  }
  
  // Check if request is coming from the same origin
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'https://localhost:3000'
  ].filter(Boolean);
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : '');
  
  return allowedOrigins.some(allowed => requestOrigin.includes(allowed || ''));
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          message: 'Too many applications submitted. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { status: 429 }
      );
    }
    
    // Validate CSRF token / origin
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { message: 'Invalid request origin' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Check honeypot field (should be empty)
    if (body[HONEYPOT_FIELD] && body[HONEYPOT_FIELD].trim() !== '') {
      // This is likely a bot submission
      console.log('Honeypot triggered for IP:', clientIP);
      return NextResponse.json(
        { message: 'Application submitted successfully' }, // Don't reveal it's blocked
        { status: 200 }
      );
    }
    
    // Sanitize all string inputs
    const sanitizedData: VolunteerApplication = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || ''),
      phone: sanitizeInput(body.phone || ''),
      city: sanitizeInput(body.city || ''),
      availability: sanitizeInput(body.availability || ''),
      skills: Array.isArray(body.skills) ? body.skills.map((skill: string) => sanitizeInput(skill)) : [],
      message: sanitizeInput(body.message || ''),
      agreedToTerms: Boolean(body.agreedToTerms)
    };
    
    // Validate all fields
    const validations = [
      validateVolunteerName(sanitizedData.name),
      validateEmail(sanitizedData.email),
      validatePhone(sanitizedData.phone),
      validateCity(sanitizedData.city),
      validateAvailability(sanitizedData.availability),
      validateSkills(sanitizedData.skills),
      validateMessage(sanitizedData.message)
    ];
    
    // Check terms agreement
    if (!sanitizedData.agreedToTerms) {
      return NextResponse.json(
        { message: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }
    
    // Collect all validation errors
    const errors: string[] = [];
    validations.forEach(validation => {
      if (!validation.isValid) {
        errors.push(...validation.errors);
      }
    });
    
    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }
    
    // Additional spam detection heuristics
    const suspiciousPatterns = [
      /(.)\1{4,}/, // Repeated characters (5 or more)
      /https?:\/\//, // URLs in name or message (except email)
      /\b(viagra|casino|lottery|winner|congratulations|urgent|act now)\b/i, // Spam keywords
    ];
    
    const textToCheck = `${sanitizedData.name} ${sanitizedData.message}`;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(textToCheck));
    
    if (isSuspicious) {
      console.log('Suspicious content detected for IP:', clientIP);
      // Log for review but don't block immediately
    }
    
    // Generate application ID
    const applicationId = `VOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    // Store the application (in a real app, save to database)
    console.log('Volunteer application received:', {
      ...sanitizedData,
      applicationId,
      ip: clientIP,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      suspicious: isSuspicious
    });
    
    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notifications to volunteer and admins
    // 3. Add to CRM system
    
    console.log('Email notifications would be sent to:', {
      volunteer: sanitizedData.email,
      admins: ['admin@sces.org', 'volunteer@sces.org']
    });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        message: 'Application submitted successfully! We will contact you soon.',
        applicationId
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing volunteer application:', error);
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}