import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useFormAccessibility, useScreenReader } from '@/hooks/useAccessibility';

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitText?: string;
  className?: string;
}

export function AccessibleForm({
  children,
  title,
  description,
  onSubmit,
  isSubmitting = false,
  submitText = 'Submit',
  className,
  ...props
}: AccessibleFormProps) {
  const { generateFieldId } = useFormAccessibility();
  const { announce } = useScreenReader();
  const formRef = useRef<HTMLFormElement>(null);
  
  const formId = React.useMemo(() => generateFieldId('form'), [generateFieldId]);
  const titleId = title ? `${formId}-title` : undefined;
  const descriptionId = description ? `${formId}-description` : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check form validity
    if (formRef.current && !formRef.current.checkValidity()) {
      // Find first invalid field and focus it
      const firstInvalidField = formRef.current.querySelector(':invalid') as HTMLElement;
      if (firstInvalidField) {
        firstInvalidField.focus();
        announce('Please correct the errors in the form', 'assertive');
      }
      return;
    }

    announce('Submitting form...', 'polite');
    onSubmit(e);
  };

  return (
    <form
      ref={formRef}
      id={formId}
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      noValidate
      {...props}
    >
      {title && (
        <h2 id={titleId} className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
      )}
      
      {description && (
        <p id={descriptionId} className="text-gray-600">
          {description}
        </p>
      )}
      
      {children}
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
          aria-describedby={isSubmitting ? `${formId}-submitting` : undefined}
        >
          {isSubmitting ? 'Submitting...' : submitText}
        </button>
        
        {isSubmitting && (
          <div 
            id={`${formId}-submitting`}
            className="sr-only"
            aria-live="polite"
          >
            Form is being submitted, please wait.
          </div>
        )}
      </div>
    </form>
  );
}

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | string[];
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleInput({
  label,
  error,
  description,
  required = false,
  className,
  ...props
}: AccessibleInputProps) {
  const { generateFieldId, createFieldProps } = useFormAccessibility();
  
  const fieldId = React.useMemo(() => generateFieldId(), [generateFieldId]);
  const labelId = `${fieldId}-label`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  
  const errorArray = Array.isArray(error) ? error : error ? [error] : [];
  const hasError = errorArray.length > 0;

  const fieldProps = createFieldProps(fieldId, labelId, errorId, descriptionId, hasError);

  return (
    <div className={cn('space-y-2', className)}>
      <label
        id={labelId}
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      <input
        {...fieldProps}
        {...props}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-gray-300',
          props.className
        )}
        required={required}
      />
      
      {hasError && (
        <div id={errorId} role="alert" aria-live="polite">
          {errorArray.map((err, index) => (
            <p key={index} className="text-sm text-red-600">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | string[];
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleTextarea({
  label,
  error,
  description,
  required = false,
  className,
  ...props
}: AccessibleTextareaProps) {
  const { generateFieldId, createFieldProps } = useFormAccessibility();
  
  const fieldId = React.useMemo(() => generateFieldId(), [generateFieldId]);
  const labelId = `${fieldId}-label`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  
  const errorArray = Array.isArray(error) ? error : error ? [error] : [];
  const hasError = errorArray.length > 0;

  const fieldProps = createFieldProps(fieldId, labelId, errorId, descriptionId, hasError);

  return (
    <div className={cn('space-y-2', className)}>
      <label
        id={labelId}
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      <textarea
        {...fieldProps}
        {...props}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
          hasError ? 'border-red-500' : 'border-gray-300',
          props.className
        )}
        required={required}
      />
      
      {hasError && (
        <div id={errorId} role="alert" aria-live="polite">
          {errorArray.map((err, index) => (
            <p key={index} className="text-sm text-red-600">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string | string[];
  description?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function AccessibleSelect({
  label,
  options,
  error,
  description,
  required = false,
  placeholder,
  className,
  ...props
}: AccessibleSelectProps) {
  const { generateFieldId, createFieldProps } = useFormAccessibility();
  
  const fieldId = React.useMemo(() => generateFieldId(), [generateFieldId]);
  const labelId = `${fieldId}-label`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  
  const errorArray = Array.isArray(error) ? error : error ? [error] : [];
  const hasError = errorArray.length > 0;

  const fieldProps = createFieldProps(fieldId, labelId, errorId, descriptionId, hasError);

  return (
    <div className={cn('space-y-2', className)}>
      <label
        id={labelId}
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      <select
        {...fieldProps}
        {...props}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          hasError ? 'border-red-500' : 'border-gray-300',
          props.className
        )}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <div id={errorId} role="alert" aria-live="polite">
          {errorArray.map((err, index) => (
            <p key={index} className="text-sm text-red-600">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}