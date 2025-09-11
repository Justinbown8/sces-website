# SCES NGO Website

A modern, responsive website for Sunrise Children Educational Society (SCES), an NGO focused on providing educational opportunities to underserved children in India.

## Features

- 🎨 Modern design with SCES brand colors and typography
- 📱 Fully responsive (mobile-first approach)
- 💳 Integrated donation system (Razorpay & PayPal)
- 🤝 Volunteer application system
- 📸 Image gallery with filtering
- 📝 Blog system for updates and stories
- ♿ WCAG AA accessibility compliant
- 🚀 Optimized for performance and SEO

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Fonts**: Montserrat (headings) & Poppins (body)
- **Payment**: Razorpay (primary), PayPal (secondary)
- **Deployment**: Vercel/Netlify ready

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   cd sces-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Add your actual API keys to .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── forms/          # Form components
│   └── gallery/        # Gallery components
├── config/             # Site configuration
├── lib/                # Utility libraries
├── styles/             # Additional styles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Content Management

The website uses JSON-based configuration files for easy content updates:

- **Site settings**: `src/config/site.ts`
- **Content updates**: Edit configuration files in `src/config/`
- **Images**: Add to `public/images/` directory

## Payment Integration

### Razorpay Setup (Primary Payment Method)
1. **Create Razorpay Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Get API Keys**: 
   - For testing: Use test keys (start with `rzp_test_`)
   - For production: Generate live keys (start with `rzp_live_`)
3. **Configure Environment Variables**:
   ```bash
   # Test Environment
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   RAZORPAY_KEY_SECRET=your_test_key_secret_here
   
   # Production Environment
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
   RAZORPAY_KEY_SECRET=your_live_key_secret_here
   ```
4. **Supported Payment Methods**:
   - UPI (Google Pay, PhonePe, Paytm, etc.)
   - Credit/Debit Cards (Visa, Mastercard, RuPay)
   - Net Banking (All major banks)
   - Wallets (Paytm, Mobikwik, etc.)

### PayPal Setup (Secondary Payment Method - Coming Soon)
1. Get credentials from [PayPal Developer](https://developer.paypal.com/)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   ```

### Payment Features
- ✅ **Secure Payment Processing**: Industry-standard encryption
- ✅ **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets
- ✅ **Recurring Donations**: Monthly, Quarterly, Yearly options
- ✅ **Payment Verification**: Server-side signature verification
- ✅ **Error Handling**: Comprehensive error handling with retry mechanism
- ✅ **Receipt Generation**: Automatic email receipts
- ✅ **Payment Status Tracking**: Real-time payment status updates
- ✅ **Mobile Optimized**: Touch-friendly payment interface

### Testing Payments
Use Razorpay test cards for testing:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Payment Security
- All payments are processed securely through Razorpay
- No card details are stored on our servers
- PCI DSS compliant payment processing
- SSL encryption for all transactions

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Add environment variables in Netlify dashboard

## Contact Information

- **Phone**: 099536 65620
- **Address**: 877/10 Ward No. 6, Mehrauli New Delhi – 110030
- **Website**: [Update with actual domain]

## Contributing

1. Follow the existing code style
2. Ensure accessibility compliance
3. Test on multiple devices and browsers
4. Update documentation as needed

## License

This project is created for Sunrise Children Educational Society (SCES).
