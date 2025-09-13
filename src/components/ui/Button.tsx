import React from 'react';
import { cn, buttonBase } from '@/lib/utils';
import accessibility from '@/lib/accessibility';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  gradient?: boolean;
  shine?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    gradient = true,
    shine = true,
    asChild = false,
    disabled,
    children,
    leftIcon,
    rightIcon,
    type = 'button',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    ...props 
  }, ref) => {
    const baseStyles = buttonBase();
    
    // Respect reduced motion preferences
    const motionClasses = MotionAccessibility.respectMotionPreference(
      'transform hover:-translate-y-0.5 transition-all duration-200',
      'transition-colors duration-200'
    );

    const variants = {
      primary: gradient 
        ? cn(
            'gradient-button text-white font-semibold',
            shine && !MotionAccessibility.prefersReducedMotion() && 'gradient-button-hover',
            'hover:shadow-lg',
            motionClasses
          )
        : cn(
            'bg-blue-800 hover:bg-blue-600 text-white font-semibold hover:shadow-lg',
            motionClasses
          ),
      secondary: cn(
        'bg-yellow-100 hover:bg-orange-500 hover:text-white text-yellow-800',
        'border border-yellow-800 font-medium hover:shadow-md',
        motionClasses
      ),
      outline: cn(
        'border-2 border-blue-800 text-blue-800',
        'hover:bg-blue-800 hover:text-white font-medium hover:shadow-md',
        motionClasses
      ),
      ghost: cn(
        'text-blue-800 hover:bg-yellow-100 font-medium hover:shadow-sm',
        motionClasses
      ),
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-sm gap-1.5',
      md: 'h-10 px-4 text-base rounded-md gap-2',
      lg: 'h-12 px-6 text-lg rounded-lg gap-2.5',
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const isDisabled = disabled || loading;

    const buttonClasses = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      isDisabled && 'opacity-50 cursor-not-allowed transform-none hover:transform-none hover:shadow-none',
      loading && 'relative',
      'select-none',
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(buttonClasses, (children.props as { className?: string })?.className),
      });
    }

    return (
      <button
        className={buttonClasses}
        disabled={isDisabled}
        ref={ref}
        type={type}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={cn(
                MotionAccessibility.prefersReducedMotion() 
                  ? 'border-2 border-current border-t-transparent' 
                  : 'animate-spin rounded-full border-2 border-current border-t-transparent',
                iconSizes[size]
              )}
              role="status"
              aria-label="Loading"
            />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        <span className={cn(
          'flex items-center justify-center gap-inherit',
          loading && 'opacity-0'
        )}>
          {leftIcon && (
            <span className={cn('flex-shrink-0', iconSizes[size])} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          
          <span className="flex-1 text-center">
            {children}
          </span>
          
          {rightIcon && (
            <span className={cn('flex-shrink-0', iconSizes[size])} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;