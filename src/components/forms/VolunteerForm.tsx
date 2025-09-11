'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useScreenReader, useFormAccessibility } from '@/hooks/useAccessibility';
import { 
  validateVolunteerName, 
  validateEmail, 
  validatePhone, 
  validateCity, 
  validateAvailability, 
  validateSkills, 
  validateMessage 
} from '@/lib/validations';
import type { VolunteerApplication } from '@/types';

interface FormErrors {
  name?: string[];
  email?: string[];
  phone?: string[];
  city?: string[];
  availability?: string[];
  skills?: string[];
  message?: string[];
  terms?: string[];
}

const availabilityOptions = [
  { value: 'weekdays', label: 'Weekdays (Monday - Friday)' },
  { value: 'weekends', label: 'Weekends (Saturday - Sunday)' },
  { value: 'evenings', label: 'Evenings (After 6 PM)' },
  { value: 'flexible', label: 'Flexible (Any time)' }
];

const skillOptions = [
  'Teaching',
  'Tutoring',
  'Computer Skills',
  'Arts & Crafts',
  'Sports & Games',
  'Music',
  'Photography',
  'Event Organization',
  'Fundraising',
  'Social Media',
  'Content Writing',
  'Translation',
  'Administrative Work',
  'Counseling',
  'First Aid'
];

export function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerApplication>({
    name: '',
    email: '',
    phone: '',
    city: '',
    availability: '',
    skills: [],
    message: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Honeypot field (should remain empty)
  const [honeypot, setHoneypot] = useState('');
  
  // Accessibility hooks
  const { announce } = useScreenReader();
  const { generateFieldId, createFieldProps } = useFormAccessibility();

  const validateField = (fieldName: keyof VolunteerApplication, value: string | string[] | boolean) => {
    let validation;
    
    switch (fieldName) {
      case 'name':
        validation = validateVolunteerName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validatePhone(value);
        break;
      case 'city':
        validation = validateCity(value);
        break;
      case 'availability':
        validation = validateAvailability(value);
        break;
      case 'skills':
        validation = validateSkills(value);
        break;
      case 'message':
        validation = validateMessage(value);
        break;
      case 'agreedToTerms':
        validation = {
          isValid: value === true,
          errors: value ? [] : ['You must agree to the terms and conditions']
        };
        break;
      default:
        validation = { isValid: true, errors: [] };
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.errors
    }));

    return validation.isValid;
  };

  const handleInputChange = (field: keyof VolunteerApplication, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof VolunteerApplication) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    handleInputChange('skills', newSkills);
  };

  const validateForm = (): boolean => {
    const fields: (keyof VolunteerApplication)[] = [
      'name', 'email', 'phone', 'city', 'availability', 'skills', 'message', 'agreedToTerms'
    ];
    
    let isValid = true;
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/volunteer/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'volunteer-form', // Simple CSRF token
        },
        body: JSON.stringify({
          ...formData,
          website_url: honeypot, // Honeypot field
        }),
      });

      if (response.ok) {
        // Redirect to success page
        window.location.href = '/volunteer-success';
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Volunteer Team
          </h2>
          <p className="text-gray-600">
            Help us make a difference in children&apos;s lives. Fill out the form below to apply as a volunteer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <label htmlFor="website_url">Website URL (leave blank)</label>
            <input
              type="text"
              id="website_url"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name?.length ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email?.length ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.phone?.length ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.phone?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* City Field */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.city?.length ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your city"
            />
            {errors.city?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Availability Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <div className="space-y-2">
              {availabilityOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={formData.availability === option.value}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    onBlur={() => handleBlur('availability')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.availability?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Skills Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Interests * (Select up to 5)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    onBlur={() => handleBlur('skills')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                    disabled={!formData.skills.includes(skill) && formData.skills.length >= 5}
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-700">
              Selected: {formData.skills.length}/5
            </p>
            {errors.skills?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to volunteer with SCES? *
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.message?.length ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your motivation to volunteer and how you'd like to contribute..."
            />
            <p className="mt-1 text-xs text-gray-700">
              {formData.message.length}/500 characters
            </p>
            {errors.message?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                onBlur={() => handleBlur('agreedToTerms')}
                className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                . I understand that SCES will contact me regarding volunteer opportunities. *
              </span>
            </label>
            {errors.terms?.map((error, index) => (
              <p key={index} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}