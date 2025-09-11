import React from 'react';
import { cn } from '@/lib/utils';
import { useFormAccessibility } from '@/hooks/useAccessibility';

interface AccessibleFieldProps {
  children: React.ReactElement;
  label: string;
  error?: string | string[];
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleField({
  children,
  label,
  error,
  description,
  required = false,
  className = '',
}: AccessibleFieldProps) {
  const { generateFieldId, createFieldProps } = useFormAccessibility();
  
  const fieldId = React.useMemo(() => generateFieldId(), [generateFieldId]);
  const labelId = `${fieldId}-label`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  
  const errorArray = Array.isArray(error) ? error : error ? [error] : [];
  const hasError = errorArray.length > 0;

  const fieldProps = createFieldProps(fieldId, labelId, errorId, descriptionId, hasError);

  // Clone the child element and add accessibility props
  const enhancedChild = React.cloneElement(children, {
    ...fieldProps,
    className: cn(
      children.props.className,
      hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    ),
  });

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
      
      {enhancedChild}
      
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

interface AccessibleFieldsetProps {
  children: React.ReactNode;
  legend: string;
  error?: string | string[];
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleFieldset({
  children,
  legend,
  error,
  description,
  required = false,
  className = '',
}: AccessibleFieldsetProps) {
  const { generateFieldId } = useFormAccessibility();
  
  const fieldsetId = React.useMemo(() => generateFieldId('fieldset'), [generateFieldId]);
  const legendId = `${fieldsetId}-legend`;
  const errorId = error ? `${fieldsetId}-error` : undefined;
  const descriptionId = description ? `${fieldsetId}-description` : undefined;
  
  const errorArray = Array.isArray(error) ? error : error ? [error] : [];
  const hasError = errorArray.length > 0;
  
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ');

  return (
    <fieldset
      className={cn('space-y-4', className)}
      aria-labelledby={legendId}
      aria-describedby={describedBy || undefined}
      aria-invalid={hasError}
      aria-required={required}
    >
      <legend id={legendId} className="text-sm font-medium text-gray-700">
        {legend}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </legend>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      {children}
      
      {hasError && (
        <div id={errorId} role="alert" aria-live="polite">
          {errorArray.map((err, index) => (
            <p key={index} className="text-sm text-red-600">
              {err}
            </p>
          ))}
        </div>
      )}
    </fieldset>
  );
}