import React from 'react';
import Image from 'next/image';
import { cn, cardBase } from '@/lib/utils';

export interface BaseCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export interface CardProps extends BaseCardProps {
  variant?: 'default' | 'impact' | 'testimonial' | 'staff';
}

// Base Card Component
const Card = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, hover = true, padding = 'md', ...props }, ref) => {
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardBase(),
          paddingClasses[padding],
          hover && 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title Component
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-heading text-xl font-semibold leading-tight text-foreground', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

// Card Description Component
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-gray-700 font-body leading-relaxed', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

// Card Footer Component
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

// Impact Card Component
export interface ImpactCardProps extends Omit<BaseCardProps, 'children'> {
  title: string;
  amount: string;
  description: string;
  icon?: React.ReactNode;
  currency?: string;
  highlight?: boolean;
}

const ImpactCard = React.forwardRef<HTMLDivElement, ImpactCardProps>(
  ({ 
    title, 
    amount, 
    description, 
    icon, 
    currency = '₹',
    highlight = false,
    className,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      className={cn(
        'text-center group cursor-pointer',
        highlight && 'ring-2 ring-primary-orange ring-opacity-50 bg-gradient-to-br from-accent-light to-white',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex justify-center mb-4">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            highlight ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-yellow-100 text-yellow-800',
            'group-hover:scale-110 transition-transform duration-300'
          )}>
            {icon}
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className={cn(
          'text-2xl font-bold',
          highlight && 'text-yellow-800'
        )}>
          {currency}{amount}
        </CardTitle>
        <CardDescription className={cn(
          'font-semibold text-lg',
          highlight ? 'text-yellow-800' : 'text-gray-700'
        )}>
          {title}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className={cn(
          'text-gray-700 leading-relaxed',
          highlight && 'text-gray-800'
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
);

ImpactCard.displayName = 'ImpactCard';

// Testimonial Card Component
export interface TestimonialCardProps extends Omit<BaseCardProps, 'children'> {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ 
    quote, 
    author, 
    role, 
    avatar, 
    rating,
    className,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      className={cn('relative overflow-hidden testimonial-card', className)}
      {...props}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-yellow-200 text-4xl font-serif">
        &ldquo;
      </div>
      
      <CardContent>
        {rating && (
          <div className="flex mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'w-5 h-5',
                  i < rating ? 'text-orange-500' : 'text-gray-300'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
        
        <blockquote className="text-gray-800 italic text-lg leading-relaxed mb-6 quote-text">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 pt-4">
        <div className="flex items-center space-x-3">
          {avatar ? (
            <Image
              src={avatar}
              alt={`${author}'s avatar`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-800 font-semibold text-lg">
                {author.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 author-name">{author}</p>
            {role && (
              <p className="text-sm text-gray-700 author-role">{role}</p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
);

TestimonialCard.displayName = 'TestimonialCard';

// Staff Card Component
export interface StaffCardProps extends Omit<BaseCardProps, 'children'> {
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
  onViewMore?: () => void;
}

const StaffCard = React.forwardRef<HTMLDivElement, StaffCardProps>(
  ({ 
    name, 
    role, 
    bio, 
    image, 
    email, 
    phone, 
    social,
    onViewMore,
    className,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      className={cn('text-center group', className)}
      {...props}
    >
      <div className="relative mb-4">
        {image ? (
          <Image
            src={image}
            alt={`${name}'s photo`}
            width={96}
            height={96}
            className="w-24 h-24 mx-auto rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">
              {name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-orange-500 font-semibold">
          {role}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
          {bio}
        </p>
        
        {(email || phone) && (
          <div className="mt-4 space-y-1 text-sm">
            {email && (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {email}
              </p>
            )}
            {phone && (
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {phone}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      {(social || onViewMore) && (
        <CardFooter className="justify-center space-x-3">
          {social?.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-600 transition-colors"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          
          {social?.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-600 transition-colors"
              aria-label={`${name}'s Twitter profile`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
          
          {onViewMore && (
            <button
              onClick={onViewMore}
              className="text-sm text-blue-800 hover:text-blue-600 font-medium transition-colors"
            >
              View More
            </button>
          )}
        </CardFooter>
      )}
    </Card>
  )
);

StaffCard.displayName = 'StaffCard';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  ImpactCard,
  TestimonialCard,
  StaffCard
};