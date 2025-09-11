// Site-wide settings configuration interface and implementation

export interface BrandingSettings {
  logo: {
    primary: string;
    secondary?: string;
    favicon: string;
    appleTouchIcon: string;
  };
  colors: {
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    secondary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    accent: {
      yellow: string;
      orange: string;
      navy: string;
      lightBlue: string;
    };
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface SocialSettings {
  facebook: {
    url: string;
    enabled: boolean;
  };
  instagram: {
    url: string;
    enabled: boolean;
  };
  twitter: {
    url: string;
    enabled: boolean;
  };
  linkedin: {
    url: string;
    enabled: boolean;
  };
  youtube: {
    url: string;
    enabled: boolean;
  };
}

export interface PaymentSettings {
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    webhookSecret: string;
    currency: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
    currency: string;
  };
  defaultCurrency: string;
  minimumAmount: number;
  maximumAmount: number;
}

export interface SEOSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  openGraph: {
    siteName: string;
    type: string;
    locale: string;
    defaultImage: string;
  };
  twitter: {
    card: string;
    site: string;
    creator: string;
  };
  structuredData: {
    organizationName: string;
    organizationType: string;
    url: string;
    logo: string;
    contactPoint: {
      telephone: string;
      contactType: string;
      areaServed: string;
      availableLanguage: string[];
    };
  };
}

export interface AnalyticsSettings {
  googleAnalytics: {
    enabled: boolean;
    measurementId: string;
  };
  facebookPixel: {
    enabled: boolean;
    pixelId: string;
  };
  hotjar: {
    enabled: boolean;
    siteId: string;
  };
}

export interface SecuritySettings {
  honeypot: {
    enabled: boolean;
    fieldName: string;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  csrf: {
    enabled: boolean;
    secret: string;
  };
}

export interface SiteSettings {
  branding: BrandingSettings;
  social: SocialSettings;
  payment: PaymentSettings;
  seo: SEOSettings;
  analytics: AnalyticsSettings;
  security: SecuritySettings;
}

// Default settings configuration
export const defaultSettings: SiteSettings = {
  branding: {
    logo: {
      primary: "/logo.svg",
      secondary: "/logo-white.svg",
      favicon: "/favicon.ico",
      appleTouchIcon: "/apple-touch-icon.png"
    },
    colors: {
      primary: {
        50: "#fef7e0",
        100: "#fdecc8",
        200: "#fbd38d",
        300: "#f6ad55",
        400: "#ed8936",
        500: "#dd6b20",
        600: "#c05621",
        700: "#9c4221",
        800: "#7c2d12",
        900: "#652b19"
      },
      secondary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a"
      },
      accent: {
        yellow: "#FFD700",
        orange: "#FF8C00",
        navy: "#1E3A8A",
        lightBlue: "#3B82F6"
      },
      neutral: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b"
      }
    },
    typography: {
      fontFamily: {
        heading: "Montserrat, system-ui, sans-serif",
        body: "Poppins, system-ui, sans-serif",
        mono: "ui-monospace, SFMono-Regular, monospace"
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem"
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
      "3xl": "6rem",
      "4xl": "8rem"
    },
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px"
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }
  },
  social: {
    facebook: {
      url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/sces-ngo",
      enabled: true
    },
    instagram: {
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/sces-ngo",
      enabled: true
    },
    twitter: {
      url: process.env.NEXT_PUBLIC_TWITTER_URL || "",
      enabled: false
    },
    linkedin: {
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
      enabled: false
    },
    youtube: {
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
      enabled: false
    }
  },
  payment: {
    razorpay: {
      enabled: process.env.DISABLE_RAZORPAY !== 'true' && !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      keySecret: process.env.RAZORPAY_KEY_SECRET || "",
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
      currency: "INR"
    },
    paypal: {
      enabled: process.env.DISABLE_PAYPAL !== 'true' && !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      currency: "USD"
    },
    defaultCurrency: "INR",
    minimumAmount: 100,
    maximumAmount: 500000
  },
  seo: {
    defaultTitle: "Sunrise Children Educational Society - Empowering Children Through Education",
    titleTemplate: "%s | SCES",
    defaultDescription: "Providing educational opportunities to underserved children across India. Join us in creating brighter futures through quality education and community support.",
    defaultKeywords: [
      "NGO",
      "education",
      "children",
      "India",
      "charity",
      "donation",
      "volunteer",
      "social work",
      "community development",
      "child welfare"
    ],
    openGraph: {
      siteName: "Sunrise Children Educational Society",
      type: "website",
      locale: "en_IN",
      defaultImage: "/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      site: "@sces_ngo",
      creator: "@sces_ngo"
    },
    structuredData: {
      organizationName: "Sunrise Children Educational Society",
      organizationType: "NGO",
      url: "https://sces-ngo.org",
      logo: "https://sces-ngo.org/logo.svg",
      contactPoint: {
        telephone: "+91-99536-65620",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"]
      }
    }
  },
  analytics: {
    googleAnalytics: {
      enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""
    },
    facebookPixel: {
      enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || ""
    },
    hotjar: {
      enabled: !!process.env.NEXT_PUBLIC_HOTJAR_SITE_ID,
      siteId: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID || ""
    }
  },
  security: {
    honeypot: {
      enabled: true,
      fieldName: "website"
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    },
    csrf: {
      enabled: true,
      secret: process.env.CSRF_SECRET || "default-csrf-secret-change-in-production"
    }
  }
};

export default defaultSettings;