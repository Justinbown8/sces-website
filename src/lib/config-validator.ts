// Configuration validation utility for the entire system

import { validateContentConfig } from '@/lib/content-validation';
import { validateSiteSettings } from '@/lib/settings-manager';
import { validateEnvironmentVariables } from '@/lib/env-manager';
import { contentConfig } from '@/config/content';
import { defaultSettings } from '@/config/settings';

export interface ValidationReport {
  overall: {
    isValid: boolean;
    score: number; // 0-100
    summary: string;
  };
  content: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  settings: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  environment: {
    isValid: boolean;
    missing: string[];
    warnings: string[];
  };
  recommendations: string[];
}

export class ConfigValidator {
  public static validate(): ValidationReport {
    const report: ValidationReport = {
      overall: {
        isValid: true,
        score: 100,
        summary: ''
      },
      content: {
        isValid: true,
        errors: [],
        warnings: []
      },
      settings: {
        isValid: true,
        errors: [],
        warnings: []
      },
      environment: {
        isValid: true,
        missing: [],
        warnings: []
      },
      recommendations: []
    };

    // Validate content configuration
    try {
      const contentValidation = validateContentConfig(contentConfig);
      report.content.isValid = contentValidation.isValid;
      report.content.errors = contentValidation.errors.map(e => `${e.field}: ${e.message}`);
    } catch (error) {
      report.content.isValid = false;
      report.content.errors.push(`Content validation failed: ${error}`);
    }

    // Validate settings configuration
    try {
      validateSiteSettings(defaultSettings);
      report.settings.isValid = true;
    } catch (error) {
      report.settings.isValid = false;
      report.settings.errors.push(`Settings validation failed: ${error}`);
    }

    // Validate environment variables
    const envValidation = validateEnvironmentVariables();
    report.environment.isValid = envValidation.isValid;
    report.environment.missing = envValidation.missing;
    report.environment.warnings = envValidation.warnings;

    // Calculate overall score and validity
    let score = 100;
    let validSections = 0;
    const totalSections = 3;

    if (report.content.isValid) validSections++;
    else score -= 40;

    if (report.settings.isValid) validSections++;
    else score -= 30;

    if (report.environment.isValid) validSections++;
    else score -= 30;

    // Deduct points for warnings
    const totalWarnings = report.content.warnings.length + 
                         report.settings.warnings.length + 
                         report.environment.warnings.length;
    score -= Math.min(totalWarnings * 5, 20);

    report.overall.isValid = validSections === totalSections;
    report.overall.score = Math.max(0, score);

    // Generate summary
    if (report.overall.isValid) {
      report.overall.summary = 'All configurations are valid and ready for production.';
    } else {
      const issues = [];
      if (!report.content.isValid) issues.push('content configuration');
      if (!report.settings.isValid) issues.push('site settings');
      if (!report.environment.isValid) issues.push('environment variables');
      
      report.overall.summary = `Issues found in: ${issues.join(', ')}. Please review and fix before deployment.`;
    }

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  private static generateRecommendations(report: ValidationReport): string[] {
    const recommendations: string[] = [];

    // Content recommendations
    if (report.content.errors.length > 0) {
      recommendations.push('Fix content configuration errors to ensure proper website functionality.');
    }

    // Settings recommendations
    if (report.settings.errors.length > 0) {
      recommendations.push('Review and correct site settings configuration.');
    }

    // Environment recommendations
    if (report.environment.missing.length > 0) {
      recommendations.push('Set missing environment variables in your .env.local file.');
    }

    if (report.environment.warnings.length > 0) {
      recommendations.push('Consider setting optional environment variables for enhanced functionality.');
    }

    // General recommendations
    if (report.overall.score < 90) {
      recommendations.push('Run configuration validation regularly to maintain system health.');
    }

    if (process.env.NODE_ENV === 'production' && !report.overall.isValid) {
      recommendations.push('⚠️  CRITICAL: Fix all configuration issues before deploying to production.');
    }

    // Performance recommendations
    recommendations.push('Regularly review and update content to keep the website fresh and engaging.');
    recommendations.push('Monitor analytics settings to ensure proper tracking is configured.');
    recommendations.push('Keep payment configuration secure and test regularly.');

    return recommendations;
  }

  public static generateReport(): string {
    const report = this.validate();
    
    let output = '# Configuration Validation Report\n\n';
    
    // Overall status
    output += `## Overall Status\n`;
    output += `- **Valid:** ${report.overall.isValid ? '✅ Yes' : '❌ No'}\n`;
    output += `- **Score:** ${report.overall.score}/100\n`;
    output += `- **Summary:** ${report.overall.summary}\n\n`;

    // Content validation
    output += `## Content Configuration\n`;
    output += `- **Status:** ${report.content.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
    if (report.content.errors.length > 0) {
      output += `- **Errors:**\n`;
      report.content.errors.forEach(error => {
        output += `  - ${error}\n`;
      });
    }
    if (report.content.warnings.length > 0) {
      output += `- **Warnings:**\n`;
      report.content.warnings.forEach(warning => {
        output += `  - ${warning}\n`;
      });
    }
    output += '\n';

    // Settings validation
    output += `## Site Settings\n`;
    output += `- **Status:** ${report.settings.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
    if (report.settings.errors.length > 0) {
      output += `- **Errors:**\n`;
      report.settings.errors.forEach(error => {
        output += `  - ${error}\n`;
      });
    }
    if (report.settings.warnings.length > 0) {
      output += `- **Warnings:**\n`;
      report.settings.warnings.forEach(warning => {
        output += `  - ${warning}\n`;
      });
    }
    output += '\n';

    // Environment validation
    output += `## Environment Variables\n`;
    output += `- **Status:** ${report.environment.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
    if (report.environment.missing.length > 0) {
      output += `- **Missing Required Variables:**\n`;
      report.environment.missing.forEach(missing => {
        output += `  - ${missing}\n`;
      });
    }
    if (report.environment.warnings.length > 0) {
      output += `- **Warnings:**\n`;
      report.environment.warnings.forEach(warning => {
        output += `  - ${warning}\n`;
      });
    }
    output += '\n';

    // Recommendations
    if (report.recommendations.length > 0) {
      output += `## Recommendations\n`;
      report.recommendations.forEach(rec => {
        output += `- ${rec}\n`;
      });
      output += '\n';
    }

    // Footer
    output += `---\n`;
    output += `*Report generated on ${new Date().toISOString()}*\n`;

    return output;
  }

  // Utility method to check specific configuration aspects
  public static checkPaymentConfiguration(): boolean {
    try {
      const settings = defaultSettings.payment;
      return (settings.razorpay.enabled && settings.razorpay.keyId && settings.razorpay.keySecret) ||
             (settings.paypal.enabled && settings.paypal.clientId && settings.paypal.clientSecret);
    } catch {
      return false;
    }
  }

  public static checkAnalyticsConfiguration(): boolean {
    try {
      const settings = defaultSettings.analytics;
      return settings.googleAnalytics.enabled && settings.googleAnalytics.measurementId;
    } catch {
      return false;
    }
  }

  public static checkSocialMediaConfiguration(): boolean {
    try {
      const settings = defaultSettings.social;
      return Object.values(settings).some(platform => platform.enabled && platform.url);
    } catch {
      return false;
    }
  }
}

// Export utility functions
export const validateConfiguration = () => ConfigValidator.validate();
export const generateConfigReport = () => ConfigValidator.generateReport();
export const isPaymentConfigured = () => ConfigValidator.checkPaymentConfiguration();
export const isAnalyticsConfigured = () => ConfigValidator.checkAnalyticsConfiguration();
export const isSocialMediaConfigured = () => ConfigValidator.checkSocialMediaConfiguration();

export default ConfigValidator;