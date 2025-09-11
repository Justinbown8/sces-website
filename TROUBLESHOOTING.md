# SCES Website Troubleshooting Guide

This guide helps resolve common issues that may occur with the SCES NGO website.

## Quick Diagnostics

### Health Check Commands
```bash
# Check if site is running
curl -I https://your-domain.com

# Test API endpoints
curl -X POST https://your-domain.com/api/health

# Check build status
npm run build

# Validate configuration
npm run validate-config
```

## Common Issues

### 1. Build and Deployment Issues

#### Issue: Build Fails with TypeScript Errors
**Symptoms:**
- Build process stops with TypeScript compilation errors
- Red error messages about type mismatches

**Solutions:**
```bash
# Check TypeScript errors
npm run type-check

# Fix common issues
# 1. Update type definitions
npm install @types/node @types/react @types/react-dom --save-dev

# 2. Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Issue: Environment Variables Not Loading
**Symptoms:**
- Features not working (payments, analytics)
- Console errors about undefined variables
- Build warnings about missing environment variables

**Solutions:**
1. **Check file naming:**
   ```bash
   # Correct files for different environments
   .env.local          # Local development
   .env.production     # Production build
   .env.example        # Template file
   ```

2. **Verify variable format:**
   ```bash
   # Correct format (no spaces around =)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890
   
   # Incorrect format
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_1234567890
   ```

3. **Check variable prefixes:**
   ```bash
   # Client-side variables need NEXT_PUBLIC_ prefix
   NEXT_PUBLIC_SITE_URL=https://example.com
   
   # Server-side variables don't need prefix
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

#### Issue: Images Not Loading
**Symptoms:**
- Broken image icons
- 404 errors for image files
- Images not optimized

**Solutions:**
1. **Check image paths:**
   ```typescript
   // Correct - relative to public directory
   <img src="/images/gallery/photo.jpg" />
   
   // Incorrect - don't include 'public'
   <img src="/public/images/gallery/photo.jpg" />
   ```

2. **Optimize images:**
   ```bash
   # Run image optimization script
   npm run optimize-images
   
   # Or manually optimize
   # - Use WebP format when possible
   # - Compress images to reasonable file sizes
   # - Provide appropriate dimensions
   ```

3. **Check file permissions:**
   ```bash
   # Ensure images are readable
   chmod 644 public/images/**/*
   ```

### 2. Payment Gateway Issues

#### Issue: Razorpay Payments Failing
**Symptoms:**
- Payment button not appearing
- "Invalid key" errors
- Payments not processing

**Diagnostic Steps:**
1. **Check API keys:**
   ```bash
   # Test keys start with rzp_test_
   # Live keys start with rzp_live_
   echo $NEXT_PUBLIC_RAZORPAY_KEY_ID
   ```

2. **Verify account status:**
   - Login to Razorpay Dashboard
   - Check if account is activated
   - Verify KYC completion for live mode

3. **Test with curl:**
   ```bash
   curl -X POST https://api.razorpay.com/v1/orders \
     -H "Content-Type: application/json" \
     -u "YOUR_KEY_ID:YOUR_KEY_SECRET" \
     -d '{
       "amount": 50000,
       "currency": "INR",
       "receipt": "test_receipt"
     }'
   ```

**Solutions:**
1. **Update API keys:**
   ```bash
   # In your deployment platform
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_new_key
   RAZORPAY_KEY_SECRET=your_new_secret
   ```

2. **Check webhook configuration:**
   ```bash
   # Webhook URL should be accessible
   curl -X POST https://your-domain.com/api/payment/webhook
   ```

#### Issue: PayPal Integration Not Working
**Symptoms:**
- PayPal button not rendering
- Sandbox/production environment issues
- Currency conversion problems

**Solutions:**
1. **Verify PayPal credentials:**
   ```javascript
   // Check environment configuration
   const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
   ```

2. **Test PayPal API:**
   ```bash
   # Get access token
   curl -X POST https://api.sandbox.paypal.com/v1/oauth2/token \
     -H "Accept: application/json" \
     -H "Accept-Language: en_US" \
     -u "CLIENT_ID:CLIENT_SECRET" \
     -d "grant_type=client_credentials"
   ```

### 3. Form Submission Issues

#### Issue: Contact/Volunteer Forms Not Submitting
**Symptoms:**
- Form submissions fail silently
- Error messages not displaying
- Email notifications not sent

**Diagnostic Steps:**
1. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Test API endpoints:**
   ```bash
   # Test volunteer application endpoint
   curl -X POST https://your-domain.com/api/volunteer/apply \
     -H "Content-Type: application/json" \
     -d '{
       "personalInfo": {
         "name": "Test User",
         "email": "test@example.com",
         "phone": "9876543210"
       },
       "city": "Delhi",
       "availability": "weekends"
     }'
   ```

**Solutions:**
1. **Check form validation:**
   ```typescript
   // Ensure all required fields are validated
   const validation = validateVolunteerForm(formData);
   if (!validation.isValid) {
     setErrors(validation.errors);
     return;
   }
   ```

2. **Verify CSRF protection:**
   ```bash
   # Check CSRF secret is set
   echo $CSRF_SECRET
   ```

3. **Check email configuration:**
   ```bash
   # Verify SMTP settings
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

### 4. Performance Issues

#### Issue: Slow Page Loading
**Symptoms:**
- Pages take more than 3 seconds to load
- Poor Lighthouse scores
- High bounce rates

**Diagnostic Steps:**
1. **Run performance audit:**
   ```bash
   npm run perf:audit
   
   # Or use Lighthouse CLI
   lighthouse https://your-domain.com --output=html
   ```

2. **Check image optimization:**
   ```bash
   # Analyze bundle size
   npm run build:analyze
   ```

**Solutions:**
1. **Optimize images:**
   ```bash
   # Use WebP format
   # Implement lazy loading
   # Provide appropriate sizes
   ```

2. **Enable caching:**
   ```javascript
   // In next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/images/(.*)',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   ```

#### Issue: High Memory Usage
**Symptoms:**
- Server running out of memory
- Frequent crashes
- Slow response times

**Solutions:**
1. **Monitor memory usage:**
   ```bash
   # Check Node.js memory usage
   node --max-old-space-size=4096 server.js
   
   # Monitor with PM2
   pm2 monit
   ```

2. **Optimize code:**
   ```typescript
   // Avoid memory leaks
   useEffect(() => {
     const cleanup = setupEventListeners();
     return cleanup; // Always cleanup
   }, []);
   ```

### 5. SEO and Analytics Issues

#### Issue: Google Analytics Not Tracking
**Symptoms:**
- No data in Google Analytics
- Events not being recorded
- Real-time data not showing

**Solutions:**
1. **Verify tracking ID:**
   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   # Should be in format: G-XXXXXXXXXX
   ```

2. **Check implementation:**
   ```typescript
   // Ensure gtag is loaded
   if (typeof window !== 'undefined' && window.gtag) {
     window.gtag('config', measurementId);
   }
   ```

3. **Test with browser extensions:**
   - Install Google Analytics Debugger
   - Check for tracking events in console

#### Issue: Poor Search Engine Ranking
**Symptoms:**
- Site not appearing in search results
- Low organic traffic
- Missing structured data

**Solutions:**
1. **Submit sitemap:**
   ```bash
   # Check sitemap is accessible
   curl https://your-domain.com/sitemap.xml
   ```

2. **Verify structured data:**
   - Use Google's Rich Results Test
   - Check for schema.org markup
   - Validate JSON-LD data

### 6. Security Issues

#### Issue: SSL Certificate Problems
**Symptoms:**
- Browser security warnings
- "Not secure" in address bar
- Mixed content warnings

**Solutions:**
1. **Check certificate status:**
   ```bash
   # Check SSL certificate
   openssl s_client -connect your-domain.com:443 -servername your-domain.com
   ```

2. **Renew certificate:**
   ```bash
   # For Let's Encrypt
   sudo certbot renew
   
   # For Vercel/Netlify - automatic renewal
   ```

#### Issue: CSRF Token Errors
**Symptoms:**
- Form submissions failing with 403 errors
- "Invalid CSRF token" messages

**Solutions:**
1. **Check CSRF configuration:**
   ```typescript
   // Ensure CSRF secret is set
   const csrfSecret = process.env.CSRF_SECRET;
   if (!csrfSecret) {
     throw new Error('CSRF_SECRET environment variable is required');
   }
   ```

2. **Verify token generation:**
   ```typescript
   // Check token is included in forms
   <input type="hidden" name="_token" value={csrfToken} />
   ```

## Monitoring and Alerts

### Set Up Monitoring
1. **Uptime monitoring:**
   - Use services like UptimeRobot or Pingdom
   - Monitor main pages and API endpoints
   - Set up email/SMS alerts

2. **Error tracking:**
   - Implement error logging
   - Monitor JavaScript errors
   - Track API failures

3. **Performance monitoring:**
   - Use Google PageSpeed Insights
   - Monitor Core Web Vitals
   - Track user experience metrics

### Log Analysis
```bash
# Check server logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PM2 logs
pm2 logs sces-website

# Vercel logs (in dashboard)
# Netlify logs (in dashboard)
```

## Emergency Procedures

### Site Down
1. **Check server status:**
   ```bash
   # Ping server
   ping your-domain.com
   
   # Check HTTP response
   curl -I https://your-domain.com
   ```

2. **Quick fixes:**
   ```bash
   # Restart application
   pm2 restart sces-website
   
   # Restart web server
   sudo systemctl restart nginx
   ```

3. **Rollback if needed:**
   ```bash
   # Git rollback
   git checkout previous-working-commit
   npm run build
   pm2 restart sces-website
   ```

### Payment System Down
1. **Check payment gateway status:**
   - Visit Razorpay/PayPal status pages
   - Check API connectivity
   - Verify credentials

2. **Temporary measures:**
   - Display maintenance message
   - Provide alternative contact methods
   - Queue failed transactions for retry

### Data Loss Prevention
1. **Regular backups:**
   ```bash
   # Database backup (if applicable)
   # File system backup
   # Configuration backup
   ```

2. **Version control:**
   ```bash
   # Ensure all changes are committed
   git status
   git add .
   git commit -m "Emergency backup"
   git push origin main
   ```

## Getting Help

### Internal Resources
1. **Documentation:**
   - README.md - General setup and usage
   - DEPLOYMENT.md - Deployment instructions
   - Code comments - Inline documentation

2. **Configuration files:**
   - Check `src/config/` directory
   - Review environment variables
   - Validate settings

### External Resources
1. **Next.js Documentation:** https://nextjs.org/docs
2. **Razorpay Documentation:** https://razorpay.com/docs/
3. **PayPal Developer Docs:** https://developer.paypal.com/docs/
4. **Vercel Support:** https://vercel.com/support
5. **Netlify Support:** https://docs.netlify.com/

### Support Contacts
- **Technical Issues:** tech@scesngo.org
- **Payment Gateway:** Contact respective provider support
- **Hosting Platform:** Use platform-specific support channels

### Creating Support Tickets
When reporting issues, include:
1. **Error messages** (exact text)
2. **Steps to reproduce** the problem
3. **Browser/device information**
4. **Screenshots** if applicable
5. **Relevant log entries**
6. **Environment details** (staging/production)

---

**Remember:** Always test fixes in a staging environment before applying to production!