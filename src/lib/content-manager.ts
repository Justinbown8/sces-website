import { ContentConfig, contentConfig } from '@/config/content';
import { validateContentConfig, ValidationResult } from '@/lib/content-validation';
import { 
  HeroSlide, 
  Testimonial, 
  ImpactStory, 
  StaffMember, 
  BlogPost 
} from '@/types';

// Content manager class for handling content operations
export class ContentManager {
  private config: ContentConfig;
  private validationResult: ValidationResult | null = null;

  constructor(config: ContentConfig = contentConfig) {
    this.config = config;
    this.validate();
  }

  // Validate the current configuration
  private validate(): void {
    this.validationResult = validateContentConfig(this.config);
    if (!this.validationResult.isValid) {
      console.warn('Content configuration validation failed:', this.validationResult.errors);
    }
  }

  // Get validation status
  public isValid(): boolean {
    return this.validationResult?.isValid ?? false;
  }

  // Get validation errors
  public getValidationErrors() {
    return this.validationResult?.errors ?? [];
  }

  // Hero content methods
  public getHeroSlides(): HeroSlide[] {
    return this.config.hero.slides;
  }

  public getHeroSlide(index: number): HeroSlide | null {
    return this.config.hero.slides[index] ?? null;
  }

  // Mission content methods
  public getMissionTitle(): string {
    return this.config.mission.title;
  }

  public getMissionDescription(): string {
    return this.config.mission.description;
  }

  public getMissionVision(): string {
    return this.config.mission.vision;
  }

  public getMissionValues(): string[] {
    return this.config.mission.values;
  }

  // Impact content methods
  public getImpactMetrics() {
    return this.config.impact.metrics;
  }

  public getImpactStories(): ImpactStory[] {
    return this.config.impact.stories;
  }

  public getImpactStory(id: string): ImpactStory | null {
    return this.config.impact.stories.find(story => story.id === id) ?? null;
  }

  // Testimonial methods
  public getTestimonials(): Testimonial[] {
    return this.config.testimonials;
  }

  public getRandomTestimonials(count: number): Testimonial[] {
    const shuffled = [...this.config.testimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Staff methods
  public getStaffMembers(): StaffMember[] {
    return this.config.staff;
  }

  public getStaffMember(name: string): StaffMember | null {
    return this.config.staff.find(member => 
      member.name.toLowerCase() === name.toLowerCase()
    ) ?? null;
  }

  // Blog methods
  public getBlogPosts(): BlogPost[] {
    return this.config.blog.posts.sort((a, b) => 
      b.publishDate.getTime() - a.publishDate.getTime()
    );
  }

  public getBlogPost(id: string): BlogPost | null {
    return this.config.blog.posts.find(post => post.id === id) ?? null;
  }

  public getBlogCategories(): string[] {
    return this.config.blog.categories;
  }

  public getBlogPostsByCategory(category: string): BlogPost[] {
    return this.config.blog.posts.filter(post => 
      post.tags.includes(category)
    ).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  public getFeaturedBlogPosts(count: number = 3): BlogPost[] {
    return this.getBlogPosts().slice(0, count);
  }

  // Donation methods
  public getDonationPresetAmounts(): number[] {
    return this.config.donation.presetAmounts;
  }

  public getDonationImpactCards() {
    return this.config.donation.impactCards;
  }

  public getDonationImpactCard(amount: number) {
    return this.config.donation.impactCards.find(card => card.amount === amount) ?? null;
  }

  // Volunteer methods
  public getVolunteerOpportunities() {
    return this.config.volunteer.opportunities;
  }

  public getVolunteerBenefits(): string[] {
    return this.config.volunteer.benefits;
  }

  // Content update methods (for admin use)
  public updateHeroSlides(slides: HeroSlide[]): void {
    this.config.hero.slides = slides;
    this.validate();
  }

  public updateMission(mission: Partial<ContentConfig['mission']>): void {
    this.config.mission = { ...this.config.mission, ...mission };
    this.validate();
  }

  public updateImpactMetrics(metrics: Partial<ContentConfig['impact']['metrics']>): void {
    this.config.impact.metrics = { ...this.config.impact.metrics, ...metrics };
    this.validate();
  }

  public addImpactStory(story: ImpactStory): void {
    this.config.impact.stories.push(story);
    this.validate();
  }

  public updateImpactStory(id: string, updates: Partial<ImpactStory>): boolean {
    const index = this.config.impact.stories.findIndex(story => story.id === id);
    if (index === -1) return false;
    
    this.config.impact.stories[index] = { ...this.config.impact.stories[index], ...updates };
    this.validate();
    return true;
  }

  public addTestimonial(testimonial: Testimonial): void {
    this.config.testimonials.push(testimonial);
    this.validate();
  }

  public addStaffMember(member: StaffMember): void {
    this.config.staff.push(member);
    this.validate();
  }

  public addBlogPost(post: BlogPost): void {
    this.config.blog.posts.push(post);
    this.validate();
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): boolean {
    const index = this.config.blog.posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    this.config.blog.posts[index] = { ...this.config.blog.posts[index], ...updates };
    this.validate();
    return true;
  }

  // Export current configuration
  public exportConfig(): ContentConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  // Import new configuration
  public importConfig(newConfig: ContentConfig): void {
    this.config = newConfig;
    this.validate();
  }

  // Get configuration as JSON string
  public toJSON(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Load configuration from JSON string
  public fromJSON(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);
      // Convert date strings back to Date objects for blog posts
      if (parsed.blog?.posts) {
        parsed.blog.posts.forEach((post: { publishDate: string | Date }) => {
          if (typeof post.publishDate === 'string') {
            post.publishDate = new Date(post.publishDate);
          }
        });
      }
      this.config = parsed;
      this.validate();
    } catch (error) {
      throw new Error(`Failed to parse JSON configuration: ${error}`);
    }
  }
}

// Create and export a default content manager instance
export const contentManager = new ContentManager();

// Export utility functions for easy access
export const getHeroSlides = () => contentManager.getHeroSlides();
export const getMissionContent = () => ({
  title: contentManager.getMissionTitle(),
  description: contentManager.getMissionDescription(),
  vision: contentManager.getMissionVision(),
  values: contentManager.getMissionValues()
});
export const getImpactMetrics = () => contentManager.getImpactMetrics();
export const getImpactStories = () => contentManager.getImpactStories();
export const getTestimonials = () => contentManager.getTestimonials();
export const getStaffMembers = () => contentManager.getStaffMembers();
export const getBlogPosts = () => contentManager.getBlogPosts();
export const getDonationConfig = () => ({
  presetAmounts: contentManager.getDonationPresetAmounts(),
  impactCards: contentManager.getDonationImpactCards()
});
export const getVolunteerConfig = () => ({
  opportunities: contentManager.getVolunteerOpportunities(),
  benefits: contentManager.getVolunteerBenefits()
});

export default contentManager;