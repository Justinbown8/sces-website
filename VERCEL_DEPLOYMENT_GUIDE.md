# Easy Vercel Deployment Guide for SCES Website

## Why Vercel?
- **Perfect for Next.js** (made by the same team)
- **Zero configuration** needed
- **Free SSL certificate** included
- **Custom domain support** for free
- **Automatic deployments** from GitHub
- **Built-in form handling** for contact forms

## Step 1: Prepare Your Code (5 minutes)

### 1.1 Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign up/login
2. Click "New Repository"
3. Name it: `sces-website`
4. Make it **Public** (required for free plan)
5. Click "Create Repository"

### 1.2 Upload Your Code to GitHub
```bash
# In your sces-website folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sces-website.git
git push -u origin main
```

## Step 2: Deploy to Vercel (3 minutes)

### 2.1 Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (easiest option)
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Project
1. Click "New Project"
2. Find your `sces-website` repository
3. Click "Import"
4. Vercel will automatically detect it's a Next.js project
5. Click "Deploy" (no configuration needed!)

### 2.3 Wait for Deployment
- Takes 2-3 minutes
- You'll get a live URL like: `https://sces-website-abc123.vercel.app`

## Step 3: Connect Your Custom Domain (10 minutes)

### 3.1 Add Domain in Vercel
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Domains" in sidebar
4. Enter your domain: `yourdomain.com`
5. Click "Add"

### 3.2 Configure DNS (at your domain registrar)
Vercel will show you DNS records to add. You have 2 options:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @
Value: 76.76.19.61
```

### 3.3 Add Both www and non-www
1. Add `yourdomain.com`
2. Add `www.yourdomain.com`
3. Set one as primary (usually non-www)

## Step 4: Environment Variables (5 minutes)

### 4.1 Add Environment Variables in Vercel
1. Go to "Settings" → "Environment Variables"
2. Add these variables:

```
NEXT_PUBLIC_SITE_URL = https://yourdomain.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID = your_paypal_client_id
PAYPAL_CLIENT_SECRET = your_paypal_secret
CONTACT_FORM_ENDPOINT = your_form_endpoint
```

### 4.2 Redeploy
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

## Step 5: Enable Form Handling (2 minutes)

### 5.1 Update Contact Form
Your contact form will work automatically with Vercel's form handling. Just ensure your form has:

```html
<form method="POST" data-netlify="true">
  <!-- your form fields -->
</form>
```

## Complete Deployment Checklist

### ✅ Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All images optimized
- [ ] Environment variables ready
- [ ] Domain purchased/ready

### ✅ Vercel Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Initial deployment successful
- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL certificate active

### ✅ Post-Deployment
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Contact form working
- [ ] PayPal integration tested
- [ ] Mobile responsiveness checked
- [ ] SEO meta tags verified

## Automatic Updates

### How It Works
1. Make changes to your code locally
2. Push to GitHub: `git push`
3. Vercel automatically deploys the changes
4. Live site updates in 2-3 minutes

### Branch Previews
- Create feature branches for testing
- Each branch gets its own preview URL
- Merge to `main` to update live site

## Free Features You Get

### ✅ Included Free
- **Unlimited personal projects**
- **100GB bandwidth per month**
- **Custom domain support**
- **Free SSL certificate**
- **Automatic HTTPS redirect**
- **Global CDN**
- **Form submissions** (100/month)
- **Serverless functions**
- **Analytics** (basic)

### 💰 Paid Features (if needed later)
- More bandwidth
- Team collaboration
- Advanced analytics
- Password protection

## Troubleshooting Common Issues

### Issue 1: Build Fails
**Solution:** Check your `package.json` scripts:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### Issue 2: Images Not Loading
**Solution:** Ensure images are in `public/` folder and paths start with `/`

### Issue 3: Environment Variables Not Working
**Solution:** 
1. Add variables in Vercel dashboard
2. Redeploy the project
3. Use `NEXT_PUBLIC_` prefix for client-side variables

### Issue 4: Domain Not Connecting
**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS settings with your registrar
3. Try both A record and CNAME methods

### Issue 5: Form Not Submitting
**Solution:** Ensure form has proper attributes and test with Vercel's form handling

## Performance Tips

### 🚀 Speed Optimizations
- Images automatically optimized by Vercel
- Global CDN for fast loading worldwide
- Automatic code splitting
- Static generation where possible

### 📊 Monitoring
- Check Vercel Analytics for performance
- Monitor Core Web Vitals
- Set up error tracking

## Security Features

### 🔒 Built-in Security
- **HTTPS everywhere** (automatic)
- **DDoS protection**
- **Edge caching**
- **Secure headers** (configurable)

### 🛡️ Additional Security
Add security headers in `next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

## Cost Breakdown

### Free Tier Limits
- **Bandwidth:** 100GB/month
- **Builds:** 6,000 minutes/month
- **Serverless Functions:** 100GB-hours/month
- **Form Submissions:** 100/month

### When You Might Need Pro ($20/month)
- High traffic (>100GB bandwidth)
- Team collaboration
- Advanced analytics
- More form submissions

## Support Resources

### 📚 Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### 🆘 Getting Help
- Vercel Discord community
- GitHub issues
- Stack Overflow

### 📧 Contact Support
- Free tier: Community support
- Pro tier: Email support

## Summary

**Total Time:** ~25 minutes
**Cost:** Free (with your own domain)
**Maintenance:** Zero (automatic updates)

This setup gives you:
- Professional hosting
- Automatic deployments
- Global CDN
- SSL certificate
- Form handling
- Analytics
- 99.9% uptime

Perfect for your SCES NGO website! 🚀