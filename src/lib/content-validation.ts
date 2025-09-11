import { ContentConfig } from '@/config/content';
import { 
  HeroSlide, 
  Testimonial, 
  ImpactStory, 
  StaffMember, 
  BlogPost 
} from '@/types';

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Helper function to check if a string is not empty
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Helper function to check if a number is positive
const isPositiveNumber = (value: unknown): value is number => {
  return typeof value === 'number' && value > 0;
};



// Validate hero slide
export const validateHeroSlide = (slide: HeroSlide, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `hero.slides[${index}]`;

  if (!isNonEmptyString(slide.image)) {
    errors.push({
      field: `${prefix}.image`,
      message: 'Hero slide image is required and must be a non-empty string',
      value: slide.image
    });
  }

  if (!isNonEmptyString(slide.title)) {
    errors.push({
      field: `${prefix}.title`,
      message: 'Hero slide title is required and must be a non-empty string',
      value: slide.title
    });
  }

  if (!isNonEmptyString(slide.subtitle)) {
    errors.push({
      field: `${prefix}.subtitle`,
      message: 'Hero slide subtitle is required and must be a non-empty string',
      value: slide.subtitle
    });
  }

  if (!slide.ctaPrimary || !isNonEmptyString(slide.ctaPrimary.text) || !isNonEmptyString(slide.ctaPrimary.href)) {
    errors.push({
      field: `${prefix}.ctaPrimary`,
      message: 'Hero slide primary CTA must have valid text and href',
      value: slide.ctaPrimary
    });
  }

  return errors;
};

// Validate testimonial
export const validateTestimonial = (testimonial: Testimonial, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `testimonials[${index}]`;

  if (!isNonEmptyString(testimonial.name)) {
    errors.push({
      field: `${prefix}.name`,
      message: 'Testimonial name is required and must be a non-empty string',
      value: testimonial.name
    });
  }

  if (!isNonEmptyString(testimonial.content)) {
    errors.push({
      field: `${prefix}.content`,
      message: 'Testimonial content is required and must be a non-empty string',
      value: testimonial.content
    });
  }

  if (testimonial.content && testimonial.content.length > 500) {
    errors.push({
      field: `${prefix}.content`,
      message: 'Testimonial content should not exceed 500 characters',
      value: testimonial.content.length
    });
  }

  return errors;
};

// Validate impact story
export const validateImpactStory = (story: ImpactStory, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `impact.stories[${index}]`;

  if (!isNonEmptyString(story.id)) {
    errors.push({
      field: `${prefix}.id`,
      message: 'Impact story ID is required and must be a non-empty string',
      value: story.id
    });
  }

  if (!isNonEmptyString(story.title)) {
    errors.push({
      field: `${prefix}.title`,
      message: 'Impact story title is required and must be a non-empty string',
      value: story.title
    });
  }

  if (!isNonEmptyString(story.studentName)) {
    errors.push({
      field: `${prefix}.studentName`,
      message: 'Impact story student name is required and must be a non-empty string',
      value: story.studentName
    });
  }

  if (!isNonEmptyString(story.location)) {
    errors.push({
      field: `${prefix}.location`,
      message: 'Impact story location is required and must be a non-empty string',
      value: story.location
    });
  }

  if (!isNonEmptyString(story.story)) {
    errors.push({
      field: `${prefix}.story`,
      message: 'Impact story content is required and must be a non-empty string',
      value: story.story
    });
  }

  if (!isNonEmptyString(story.quote)) {
    errors.push({
      field: `${prefix}.quote`,
      message: 'Impact story quote is required and must be a non-empty string',
      value: story.quote
    });
  }

  if (!Array.isArray(story.achievements) || story.achievements.length === 0) {
    errors.push({
      field: `${prefix}.achievements`,
      message: 'Impact story must have at least one achievement',
      value: story.achievements
    });
  }

  if (!Array.isArray(story.timeline) || story.timeline.length === 0) {
    errors.push({
      field: `${prefix}.timeline`,
      message: 'Impact story must have at least one timeline event',
      value: story.timeline
    });
  }

  return errors;
};

// Validate staff member
export const validateStaffMember = (member: StaffMember, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `staff[${index}]`;

  if (!isNonEmptyString(member.name)) {
    errors.push({
      field: `${prefix}.name`,
      message: 'Staff member name is required and must be a non-empty string',
      value: member.name
    });
  }

  if (!isNonEmptyString(member.role)) {
    errors.push({
      field: `${prefix}.role`,
      message: 'Staff member role is required and must be a non-empty string',
      value: member.role
    });
  }

  if (!isNonEmptyString(member.bio)) {
    errors.push({
      field: `${prefix}.bio`,
      message: 'Staff member bio is required and must be a non-empty string',
      value: member.bio
    });
  }

  if (member.bio && member.bio.length > 1000) {
    errors.push({
      field: `${prefix}.bio`,
      message: 'Staff member bio should not exceed 1000 characters',
      value: member.bio.length
    });
  }

  return errors;
};

// Validate blog post
export const validateBlogPost = (post: BlogPost, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `blog.posts[${index}]`;

  if (!isNonEmptyString(post.id)) {
    errors.push({
      field: `${prefix}.id`,
      message: 'Blog post ID is required and must be a non-empty string',
      value: post.id
    });
  }

  if (!isNonEmptyString(post.title)) {
    errors.push({
      field: `${prefix}.title`,
      message: 'Blog post title is required and must be a non-empty string',
      value: post.title
    });
  }

  if (!isNonEmptyString(post.excerpt)) {
    errors.push({
      field: `${prefix}.excerpt`,
      message: 'Blog post excerpt is required and must be a non-empty string',
      value: post.excerpt
    });
  }

  if (!isNonEmptyString(post.content)) {
    errors.push({
      field: `${prefix}.content`,
      message: 'Blog post content is required and must be a non-empty string',
      value: post.content
    });
  }

  if (!isNonEmptyString(post.author)) {
    errors.push({
      field: `${prefix}.author`,
      message: 'Blog post author is required and must be a non-empty string',
      value: post.author
    });
  }

  if (!(post.publishDate instanceof Date) || isNaN(post.publishDate.getTime())) {
    errors.push({
      field: `${prefix}.publishDate`,
      message: 'Blog post publish date must be a valid Date object',
      value: post.publishDate
    });
  }

  if (!Array.isArray(post.tags)) {
    errors.push({
      field: `${prefix}.tags`,
      message: 'Blog post tags must be an array',
      value: post.tags
    });
  }

  return errors;
};

// Main validation function for content configuration
export const validateContentConfig = (config: ContentConfig): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate hero slides
  if (!Array.isArray(config.hero.slides) || config.hero.slides.length === 0) {
    errors.push({
      field: 'hero.slides',
      message: 'Hero slides must be a non-empty array',
      value: config.hero.slides
    });
  } else {
    config.hero.slides.forEach((slide, index) => {
      errors.push(...validateHeroSlide(slide, index));
    });
  }

  // Validate mission content
  if (!isNonEmptyString(config.mission.title)) {
    errors.push({
      field: 'mission.title',
      message: 'Mission title is required and must be a non-empty string',
      value: config.mission.title
    });
  }

  if (!isNonEmptyString(config.mission.description)) {
    errors.push({
      field: 'mission.description',
      message: 'Mission description is required and must be a non-empty string',
      value: config.mission.description
    });
  }

  if (!isNonEmptyString(config.mission.vision)) {
    errors.push({
      field: 'mission.vision',
      message: 'Mission vision is required and must be a non-empty string',
      value: config.mission.vision
    });
  }

  if (!Array.isArray(config.mission.values) || config.mission.values.length === 0) {
    errors.push({
      field: 'mission.values',
      message: 'Mission values must be a non-empty array',
      value: config.mission.values
    });
  }

  // Validate impact metrics
  const metrics = config.impact.metrics;
  if (!isPositiveNumber(metrics.childrenHelped)) {
    errors.push({
      field: 'impact.metrics.childrenHelped',
      message: 'Children helped must be a positive number',
      value: metrics.childrenHelped
    });
  }

  if (!isPositiveNumber(metrics.volunteers)) {
    errors.push({
      field: 'impact.metrics.volunteers',
      message: 'Volunteers count must be a positive number',
      value: metrics.volunteers
    });
  }

  if (!isPositiveNumber(metrics.cities)) {
    errors.push({
      field: 'impact.metrics.cities',
      message: 'Cities count must be a positive number',
      value: metrics.cities
    });
  }

  // Validate impact stories
  if (Array.isArray(config.impact.stories)) {
    config.impact.stories.forEach((story, index) => {
      errors.push(...validateImpactStory(story, index));
    });
  }

  // Validate testimonials
  if (Array.isArray(config.testimonials)) {
    config.testimonials.forEach((testimonial, index) => {
      errors.push(...validateTestimonial(testimonial, index));
    });
  }

  // Validate staff members
  if (Array.isArray(config.staff)) {
    config.staff.forEach((member, index) => {
      errors.push(...validateStaffMember(member, index));
    });
  }

  // Validate blog posts
  if (Array.isArray(config.blog.posts)) {
    config.blog.posts.forEach((post, index) => {
      errors.push(...validateBlogPost(post, index));
    });
  }

  // Validate donation amounts
  if (!Array.isArray(config.donation.presetAmounts) || config.donation.presetAmounts.length === 0) {
    errors.push({
      field: 'donation.presetAmounts',
      message: 'Donation preset amounts must be a non-empty array',
      value: config.donation.presetAmounts
    });
  } else {
    config.donation.presetAmounts.forEach((amount, index) => {
      if (!isPositiveNumber(amount)) {
        errors.push({
          field: `donation.presetAmounts[${index}]`,
          message: 'Donation amount must be a positive number',
          value: amount
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility function to format validation errors for display
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => `${error.field}: ${error.message}`).join('\n');
};

// Utility function to validate and throw if invalid
export const validateContentConfigOrThrow = (config: ContentConfig): void => {
  const result = validateContentConfig(config);
  if (!result.isValid) {
    throw new Error(`Content configuration validation failed:\n${formatValidationErrors(result.errors)}`);
  }
};

const contentValidationExport = {
  validateContentConfig,
  validateContentConfigOrThrow,
  formatValidationErrors
};

export default contentValidationExport;