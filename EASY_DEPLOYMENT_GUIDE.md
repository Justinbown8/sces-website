# 🚀 Easy Deployment Guide for SCES Website

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Push to GitHub (if not done)
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `sces-website` repository
5. Click "Deploy" (no configuration needed!)

### Step 3: Connect Your Domain
1. In Vercel dashboard → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Follow DNS instructions from your domain provider

**✅ Done! Your site will be live in 2-3 minutes.**

---

## Option 2: Netlify (Also Easy)

### Step 1: Build Static Files
```bash
npm run build:static
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Build command: `npm run build:static`
6. Publish directory: `out`
7. Click "Deploy site"

**✅ Done! Your site will be live in 2-3 minutes.**

---

## Option 3: Static File Hosting (Any Provider)

### Step 1: Build Static Files
```bash
npm run build:static
```

### Step 2: Upload Files
1. After build completes, you'll have an `out` folder
2. Upload ALL contents of the `out` folder to your web hosting
3. Upload to `public_html` or your web root directory

**Supported Hosts:**
- Shared hosting (GoDaddy, Bluehost, etc.)
- GitHub Pages
- Firebase Hosting
- AWS S3
- Any static file host

---

## 🔧 Environment Variables (Optional)

If you want payment functionality, add these in your hosting dashboard:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 📁 What Gets Deployed

Your static site includes:
- ✅ All pages (Home, About, Gallery, etc.)
- ✅ Optimized images
- ✅ Contact forms (basic HTML)
- ✅ SEO optimization
- ✅ Mobile responsive design
- ✅ Fast loading times

**Note:** Payment processing will need environment variables configured.

---

## 🆘 Troubleshooting

### Build Fails?
```bash
# Clean and rebuild
npm run clean
npm install
npm run build:static
```

### Images Not Loading?
- Ensure all images are in the `public` folder
- Check image paths start with `/` (e.g., `/images/photo.jpg`)

### Forms Not Working?
- Basic HTML forms will work
- For advanced features, configure environment variables

---

## 🎉 Success!

Your SCES website is now live and helping children get better education! 

**Next Steps:**
1. Test all pages on your live site
2. Add your real payment credentials (if needed)
3. Share your website URL with supporters
4. Monitor donations and volunteer applications

**Need help?** The website includes comprehensive documentation and troubleshooting guides.