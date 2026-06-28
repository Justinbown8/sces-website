'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MembershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  membershipType: 'annual' | 'lifetime' | 'student';
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function MembershipForm() {
  const [formData, setFormData] = useState<MembershipFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    occupation: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    membershipType: 'annual',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return 'This field is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return undefined;
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) return 'Please enter a valid Indian phone number';
        return undefined;
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) return 'Must be at least 18 years old';
        return undefined;
      
      case 'occupation':
        if (!value.trim()) return 'Occupation is required';
        return undefined;
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        return undefined;
      
      case 'city':
        if (!value.trim()) return 'City is required';
        return undefined;
      
      case 'state':
        if (!value.trim()) return 'State is required';
        return undefined;
      
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) return 'Please enter a valid 6-digit pincode';
        return undefined;
      
      case 'membershipType':
        if (!value) return 'Please select a membership type';
        return undefined;
      
      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof MembershipFormData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Honeypot check
      if (honeypot) {
        setIsSubmitting(false);
        return;
      }

      // Send to API endpoint for database storage
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Thank you for registering! Your membership details have been saved. Opening WhatsApp to forward your application...');
        
        // Open WhatsApp redirect
        const whatsappNumber = "919953665620";
        const text = `*New Membership Application*

*Name:* ${formData.firstName} ${formData.lastName}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*DOB:* ${formData.dateOfBirth}
*Occupation:* ${formData.occupation}
*Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}
*Membership Type:* ${formData.membershipType.toUpperCase()}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          occupation: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          membershipType: 'annual',
          agreeToTerms: false
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/membership-success';
        }, 2000);
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message || 'Failed to register membership. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting membership form:', error);
      setSubmitStatus('error');
      setStatusMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const membershipPrices = {
    annual: '₹500/year',
    lifetime: '₹5,000 (one-time)',
    student: '₹250/year'
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Become a Member
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Join our community and support children's education. Fill out the form below to register.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Honeypot field */}
          <div style={{ display: 'none' }}>
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
            />
          </div>

          {/* Status Message */}
          {submitStatus !== 'idle' && (
            <div className={`p-3 sm:p-4 rounded-lg text-sm ${
              submitStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {statusMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="First name"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit phone number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Occupation *
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.occupation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your occupation"
              />
              {errors.occupation && <p className="mt-1 text-xs text-red-600">{errors.occupation}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Street address"
            />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City"
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="State"
              />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="6-digit code"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          {/* Membership Type */}
          <div>
            <label htmlFor="membershipType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Membership Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['annual', 'lifetime', 'student'] as const).map(type => (
                <label key={type} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{borderColor: formData.membershipType === type ? '#3B82F6' : '#D1D5DB'}}>
                  <input
                    type="radio"
                    name="membershipType"
                    value={type}
                    checked={formData.membershipType === type}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 capitalize">{type} Member</p>
                    <p className="text-xs text-gray-600">{membershipPrices[type]}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.membershipType && <p className="mt-1 text-xs text-red-600">{errors.membershipType}</p>}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600"
            />
            <label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-gray-700">
              I agree to the terms and conditions and consent to receive updates about SCES programs via WhatsApp and email *
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-xs text-red-600">{errors.agreeToTerms}</p>}

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full font-semibold"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Membership'}
          </Button>
        </form>
      </div>
    </Card>
  );
}
