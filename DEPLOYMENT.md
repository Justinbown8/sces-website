# SCES Website Deployment Guide

This guide provides step-by-step instructions for deploying the SCES NGO website to production.

## Pre-Deployment Checklist

### 1. Content Review
- [ ] Verify all content is accurate and up-to-date
- [ ] Check all images are optimized and have proper alt text
- [ ] Ensure contact information is correct
- [ ] Review staff profiles and testimonials
- [ ] Validate gallery images and categories

### 2. Configuration Review
- [ ] Update `src/config/site.ts` with production URLs
- [ ] Set correct social media links
- [ ] Configure payment gateway credentials
- [ ] Set up analytics tracking IDs
- [ ] Review SEO metadata and structured data

### 3. Testing
- [ ] Run integration tests: `node tests/simple-test.js`
- [ ] Test all forms with valid and invalid data
- [ ] Verify payment flows (use test credentials)
- [ ] Check responsive design on multiple devices
- [ ] Test accessibility with screen readers
- [ ] Validate performance with Lighthouse

## Environment Variables Setup

### Required Environment Variables

Create these environment variables in your deployment platform:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Security
CSRF_SECRET=your-secure-random-string-min-32-chars

# Payment Configuration - Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Payment Configuration - PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Social Media URLs
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/your-page
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/your-account
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/your-company
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/channel/your-channel

# Email Configuration (if using email notifications)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

### Environment Variable Security

- **Never commit** `.env.local` or `.env.production` files to version control
- Use strong, randomly generated secrets for CSRF_SECRET
- Store sensitive credentials securely in your deployment platform
- Use different credentials for staging and production environments

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and global CDN.

#### Step 1: Prepare Repository
```bash
# Ensure your code is pushed to GitHub/GitLab/Bitbucket
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `sces-website` (if in subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Configure Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all required environment variables (see list above)
3. Set environment to "Production"

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test the deployed site
4. Configure custom domain if needed

#### Step 5: Set Up Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `scesngo.org`)
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

### Option 2: Netlify

#### Step 1: Build Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. Add environment variables in Site Settings → Environment Variables
6. Deploy the site

### Option 3: Traditional Server (VPS/Dedicated)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

#### Step 2: Deploy Application
```bash
# Clone repository
git clone <your-repository-url>
cd sces-website

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
# Edit .env.production with production values

# Build application
npm run build

# Start with PM2
pm2 start npm --name "sces-website" -- start
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx
Create `/etc/nginx/sites-available/sces-website`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/sces-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Payment Gateway Configuration

### Razorpay Production Setup

#### Step 1: Account Activation
1. Complete KYC verification in Razorpay Dashboard
2. Submit required business documents
3. Wait for account activation (usually 24-48 hours)

#### Step 2: Generate Live API Keys
1. Go to Settings → API Keys in Razorpay Dashboard
2. Generate live API keys
3. Download and securely store the keys
4. Update environment variables with live keys

#### Step 3: Webhook Configuration
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret and add to environment variables

#### Step 4: Test Live Payments
1. Make a small test donation (₹1)
2. Verify payment flow works correctly
3. Check webhook notifications are received
4. Confirm email receipts are sent

### PayPal Production Setup

#### Step 1: Business Account
1. Create PayPal Business account
2. Complete business verification
3. Enable payment receiving

#### Step 2: App Configuration
1. Go to PayPal Developer Dashboard
2. Switch to "Live" environment
3. Create new app for production
4. Copy Client ID and Secret
5. Update environment variables

## DNS Configuration

### Required DNS Records

Configure these DNS records with your domain registrar:

```
Type    Name    Value                           TTL
A       @       [Your server IP or Vercel IP]  300
A       www     [Your server IP or Vercel IP]  300
CNAME   www     your-domain.com                 300
```

For Vercel:
```
Type    Name    Value                   TTL
CNAME   @       cname.vercel-dns.com   300
CNAME   www     cname.vercel-dns.com   300
```

### Email Configuration (Optional)

If setting up custom email (info@scesngo.org):

```
Type    Name    Value                       TTL
MX      @       mail.your-email-provider    300
TXT     @       "v=spf1 include:provider"   300
```

## Post-Deployment Tasks

### 1. Verify Functionality
- [ ] Test all pages load correctly
- [ ] Verify forms submit successfully
- [ ] Test payment flows with small amounts
- [ ] Check email notifications work
- [ ] Validate contact information is correct

### 2. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Configure social media meta tags
- [ ] Test structured data with Google's Rich Results Test

### 3. Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize images if needed
- [ ] Configure CDN caching
- [ ] Set up monitoring and alerts

### 4. Security
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure security headers
- [ ] Set up regular backups
- [ ] Monitor for security vulnerabilities

### 5. Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Monitor payment transactions
- [ ] Set up performance monitoring

## Maintenance

### Regular Tasks
- **Weekly**: Check for broken links and forms
- **Monthly**: Review analytics and performance
- **Quarterly**: Update dependencies and security patches
- **Annually**: Renew SSL certificates and review content

### Content Updates
1. Update content in configuration files
2. Test changes locally
3. Deploy to staging environment (if available)
4. Deploy to production
5. Verify changes are live

### Emergency Procedures
1. **Site Down**: Check server status, DNS, and SSL certificate
2. **Payment Issues**: Verify payment gateway status and credentials
3. **Performance Issues**: Check server resources and CDN status
4. **Security Issues**: Immediately update affected components

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure secrets are properly encoded

#### Payment Gateway Issues
- Verify API keys are correct and active
- Check webhook URLs are accessible
- Confirm account is activated for live transactions

#### Performance Issues
- Run performance audit: `npm run perf:audit`
- Check image optimization
- Verify CDN configuration

### Getting Help

1. Check deployment platform documentation
2. Review error logs in deployment dashboard
3. Test locally with production environment variables
4. Contact payment gateway support for payment issues

## Rollback Procedures

### Vercel/Netlify
1. Go to deployment dashboard
2. Find previous successful deployment
3. Click "Promote to Production"

### Traditional Server
```bash
# Using PM2
pm2 stop sces-website
git checkout previous-working-commit
npm install
npm run build
pm2 restart sces-website
```

## Security Considerations

### Best Practices
- Use HTTPS everywhere
- Keep dependencies updated
- Implement proper error handling
- Sanitize user inputs
- Use environment variables for secrets
- Regular security audits
- Monitor for suspicious activity

### Compliance
- GDPR compliance for EU visitors
- Accessibility compliance (WCAG AA)
- Payment card industry (PCI) compliance through payment gateways

---

## Support Contacts

- **Technical Issues**: tech@scesngo.org
- **Payment Issues**: Contact Razorpay/PayPal support
- **Domain/DNS Issues**: Contact domain registrar
- **Hosting Issues**: Contact hosting provider support

Remember to keep this deployment guide updated as the project evolves!