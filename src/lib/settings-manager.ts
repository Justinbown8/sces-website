import { SiteSettings, defaultSettings } from '@/config/settings';
import { ContentError, ContentValidationError } from '@/lib/content-errors';

// Settings validation functions
export const validatePaymentSettings = (settings: SiteSettings['payment']): void => {
  if (settings.razorpay.enabled) {
    if (!settings.razorpay.keyId) {
      throw new ContentValidationError('Razorpay Key ID is required when Razorpay is enabled', 'payment.razorpay.keyId');
    }
    if (!settings.razorpay.keySecret) {
      throw new ContentValidationError('Razorpay Key Secret is required when Razorpay is enabled', 'payment.razorpay.keySecret');
    }
  }

  if (settings.paypal.enabled) {
    if (!settings.paypal.clientId) {
      throw new ContentValidationError('PayPal Client ID is required when PayPal is enabled', 'payment.paypal.clientId');
    }
    if (!settings.paypal.clientSecret) {
      throw new ContentValidationError('PayPal Client Secret is required when PayPal is enabled', 'payment.paypal.clientSecret');
    }
  }

  if (settings.minimumAmount <= 0) {
    throw new ContentValidationError('Minimum amount must be greater than 0', 'payment.minimumAmount');
  }

  if (settings.maximumAmount <= settings.minimumAmount) {
    throw new ContentValidationError('Maximum amount must be greater than minimum amount', 'payment.maximumAmount');
  }
};

export const validateSocialSettings = (settings: SiteSettings['social']): void => {
  Object.entries(settings).forEach(([platform, config]) => {
    if (config.enabled && !config.url) {
      throw new ContentValidationError(
        `${platform} URL is required when ${platform} is enabled`,
        `social.${platform}.url`
      );
    }
    
    if (config.url && config.enabled) {
      try {
        new URL(config.url);
      } catch {
        throw new ContentValidationError(
          `${platform} URL must be a valid URL`,
          `social.${platform}.url`,
          config.url
        );
      }
    }
  });
};

export const validateBrandingSettings = (settings: SiteSettings['branding']): void => {
  // Validate required logo paths
  if (!settings.logo.primary) {
    throw new ContentValidationError('Primary logo path is required', 'branding.logo.primary');
  }

  if (!settings.logo.favicon) {
    throw new ContentValidationError('Favicon path is required', 'branding.logo.favicon');
  }

  // Validate color palette completeness
  const requiredColorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  
  ['primary', 'secondary', 'neutral'].forEach(colorType => {
    const colors = settings.colors[colorType as keyof typeof settings.colors];
    if (typeof colors === 'object') {
      requiredColorShades.forEach(shade => {
        if (!(shade in colors)) {
          throw new ContentValidationError(
            `Color shade ${shade} is missing from ${colorType} palette`,
            `branding.colors.${colorType}.${shade}`
          );
        }
      });
    }
  });

  // Validate typography settings
  if (!settings.typography.fontFamily.heading) {
    throw new ContentValidationError('Heading font family is required', 'branding.typography.fontFamily.heading');
  }

  if (!settings.typography.fontFamily.body) {
    throw new ContentValidationError('Body font family is required', 'branding.typography.fontFamily.body');
  }
};

export const validateSEOSettings = (settings: SiteSettings['seo']): void => {
  if (!settings.defaultTitle) {
    throw new ContentValidationError('Default title is required', 'seo.defaultTitle');
  }

  if (!settings.defaultDescription) {
    throw new ContentValidationError('Default description is required', 'seo.defaultDescription');
  }

  if (settings.defaultDescription.length > 160) {
    throw new ContentValidationError(
      'Default description should not exceed 160 characters',
      'seo.defaultDescription',
      settings.defaultDescription.length
    );
  }

  if (!settings.openGraph.siteName) {
    throw new ContentValidationError('Open Graph site name is required', 'seo.openGraph.siteName');
  }

  if (!settings.structuredData.organizationName) {
    throw new ContentValidationError('Organization name is required for structured data', 'seo.structuredData.organizationName');
  }

  if (settings.structuredData.url) {
    try {
      new URL(settings.structuredData.url);
    } catch {
      throw new ContentValidationError(
        'Organization URL must be a valid URL',
        'seo.structuredData.url',
        settings.structuredData.url
      );
    }
  }
};

export const validateAnalyticsSettings = (settings: SiteSettings['analytics']): void => {
  if (settings.googleAnalytics.enabled && !settings.googleAnalytics.measurementId) {
    throw new ContentValidationError(
      'Google Analytics Measurement ID is required when GA is enabled',
      'analytics.googleAnalytics.measurementId'
    );
  }

  if (settings.facebookPixel.enabled && !settings.facebookPixel.pixelId) {
    throw new ContentValidationError(
      'Facebook Pixel ID is required when Facebook Pixel is enabled',
      'analytics.facebookPixel.pixelId'
    );
  }

  if (settings.hotjar.enabled && !settings.hotjar.siteId) {
    throw new ContentValidationError(
      'Hotjar Site ID is required when Hotjar is enabled',
      'analytics.hotjar.siteId'
    );
  }
};

export const validateSecuritySettings = (settings: SiteSettings['security']): void => {
  if (settings.honeypot.enabled && !settings.honeypot.fieldName) {
    throw new ContentValidationError(
      'Honeypot field name is required when honeypot is enabled',
      'security.honeypot.fieldName'
    );
  }

  if (settings.rateLimit.enabled) {
    if (settings.rateLimit.windowMs <= 0) {
      throw new ContentValidationError(
        'Rate limit window must be greater than 0',
        'security.rateLimit.windowMs'
      );
    }

    if (settings.rateLimit.maxRequests <= 0) {
      throw new ContentValidationError(
        'Rate limit max requests must be greater than 0',
        'security.rateLimit.maxRequests'
      );
    }
  }

  if (settings.csrf.enabled && !settings.csrf.secret) {
    throw new ContentValidationError(
      'CSRF secret is required when CSRF protection is enabled',
      'security.csrf.secret'
    );
  }
};

// Main settings validation function
export const validateSiteSettings = (settings: SiteSettings): void => {
  validateBrandingSettings(settings.branding);
  validateSocialSettings(settings.social);
  validatePaymentSettings(settings.payment);
  validateSEOSettings(settings.seo);
  validateAnalyticsSettings(settings.analytics);
  validateSecuritySettings(settings.security);
};

// Settings manager class
export class SettingsManager {
  private settings: SiteSettings;

  constructor(settings: SiteSettings = defaultSettings) {
    this.settings = { ...settings };
    this.validate();
  }

  private validate(): void {
    try {
      validateSiteSettings(this.settings);
    } catch (error) {
      console.warn('Settings validation failed:', error);
    }
  }

  // Getter methods for different setting categories
  public getBrandingSettings() {
    return this.settings.branding;
  }

  public getSocialSettings() {
    return this.settings.social;
  }

  public getPaymentSettings() {
    return this.settings.payment;
  }

  public getSEOSettings() {
    return this.settings.seo;
  }

  public getAnalyticsSettings() {
    return this.settings.analytics;
  }

  public getSecuritySettings() {
    return this.settings.security;
  }

  // Specific getter methods for commonly used settings
  public getEnabledSocialPlatforms() {
    return Object.entries(this.settings.social)
      .filter(([_, config]) => config.enabled)
      .map(([platform, config]) => ({ platform, ...config }));
  }

  public getEnabledPaymentMethods() {
    const methods = [];
    if (this.settings.payment.razorpay.enabled) {
      methods.push('razorpay');
    }
    if (this.settings.payment.paypal.enabled) {
      methods.push('paypal');
    }
    return methods;
  }

  public getColorPalette() {
    return this.settings.branding.colors;
  }

  public getTypographySettings() {
    return this.settings.branding.typography;
  }

  public getLogo(type: 'primary' | 'secondary' = 'primary') {
    return type === 'secondary' && this.settings.branding.logo.secondary
      ? this.settings.branding.logo.secondary
      : this.settings.branding.logo.primary;
  }

  // Update methods
  public updateBrandingSettings(updates: Partial<SiteSettings['branding']>): void {
    this.settings.branding = { ...this.settings.branding, ...updates };
    this.validate();
  }

  public updateSocialSettings(updates: Partial<SiteSettings['social']>): void {
    this.settings.social = { ...this.settings.social, ...updates };
    this.validate();
  }

  public updatePaymentSettings(updates: Partial<SiteSettings['payment']>): void {
    this.settings.payment = { ...this.settings.payment, ...updates };
    this.validate();
  }

  public updateSEOSettings(updates: Partial<SiteSettings['seo']>): void {
    this.settings.seo = { ...this.settings.seo, ...updates };
    this.validate();
  }

  public updateAnalyticsSettings(updates: Partial<SiteSettings['analytics']>): void {
    this.settings.analytics = { ...this.settings.analytics, ...updates };
    this.validate();
  }

  public updateSecuritySettings(updates: Partial<SiteSettings['security']>): void {
    this.settings.security = { ...this.settings.security, ...updates };
    this.validate();
  }

  // Environment variable integration
  public syncWithEnvironment(): void {
    // Update payment settings from environment variables
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      this.settings.payment.razorpay.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    }
    if (process.env.RAZORPAY_KEY_SECRET) {
      this.settings.payment.razorpay.keySecret = process.env.RAZORPAY_KEY_SECRET;
    }
    if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      this.settings.payment.paypal.clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    }
    if (process.env.PAYPAL_CLIENT_SECRET) {
      this.settings.payment.paypal.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    }

    // Update social settings from environment variables
    if (process.env.NEXT_PUBLIC_FACEBOOK_URL) {
      this.settings.social.facebook.url = process.env.NEXT_PUBLIC_FACEBOOK_URL;
    }
    if (process.env.NEXT_PUBLIC_INSTAGRAM_URL) {
      this.settings.social.instagram.url = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
    }

    // Update analytics settings from environment variables
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.settings.analytics.googleAnalytics.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      this.settings.analytics.googleAnalytics.enabled = true;
    }

    this.validate();
  }

  // Export/Import methods
  public exportSettings(): SiteSettings {
    return JSON.parse(JSON.stringify(this.settings));
  }

  public importSettings(newSettings: SiteSettings): void {
    this.settings = { ...newSettings };
    this.validate();
  }

  public toJSON(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  public fromJSON(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);
      this.settings = parsed;
      this.validate();
    } catch (error) {
      throw new ContentError(`Failed to parse settings JSON: ${error}`, 'PARSE_ERROR');
    }
  }

  // Generate CSS custom properties for theming
  public generateCSSCustomProperties(): string {
    const { colors, typography, spacing, borderRadius, shadows } = this.settings.branding;
    
    let css = ':root {\n';
    
    // Colors
    Object.entries(colors.primary).forEach(([shade, value]) => {
      css += `  --color-primary-${shade}: ${value};\n`;
    });
    
    Object.entries(colors.secondary).forEach(([shade, value]) => {
      css += `  --color-secondary-${shade}: ${value};\n`;
    });
    
    Object.entries(colors.neutral).forEach(([shade, value]) => {
      css += `  --color-neutral-${shade}: ${value};\n`;
    });
    
    Object.entries(colors.accent).forEach(([name, value]) => {
      css += `  --color-accent-${name}: ${value};\n`;
    });
    
    // Typography
    Object.entries(typography.fontFamily).forEach(([type, value]) => {
      css += `  --font-${type}: ${value};\n`;
    });
    
    Object.entries(typography.fontSize).forEach(([size, value]) => {
      css += `  --text-${size}: ${value};\n`;
    });
    
    // Spacing
    Object.entries(spacing).forEach(([size, value]) => {
      css += `  --spacing-${size}: ${value};\n`;
    });
    
    // Border radius
    Object.entries(borderRadius).forEach(([size, value]) => {
      css += `  --radius-${size}: ${value};\n`;
    });
    
    // Shadows
    Object.entries(shadows).forEach(([size, value]) => {
      css += `  --shadow-${size}: ${value};\n`;
    });
    
    css += '}\n';
    
    return css;
  }
}

// Create and export default settings manager instance
export const settingsManager = new SettingsManager();

// Sync with environment variables on initialization
settingsManager.syncWithEnvironment();

// Export utility functions
export const getBrandingSettings = () => settingsManager.getBrandingSettings();
export const getSocialSettings = () => settingsManager.getSocialSettings();
export const getPaymentSettings = () => settingsManager.getPaymentSettings();
export const getSEOSettings = () => settingsManager.getSEOSettings();
export const getAnalyticsSettings = () => settingsManager.getAnalyticsSettings();
export const getSecuritySettings = () => settingsManager.getSecuritySettings();
export const getEnabledSocialPlatforms = () => settingsManager.getEnabledSocialPlatforms();
export const getEnabledPaymentMethods = () => settingsManager.getEnabledPaymentMethods();
export const getColorPalette = () => settingsManager.getColorPalette();
export const getTypographySettings = () => settingsManager.getTypographySettings();

export default settingsManager;