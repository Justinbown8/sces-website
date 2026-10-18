// Donation tier copy, shared by the server-rendered donation page and the
// client-side tier selector. Kept in a plain module (no "use client") because
// non-component values exported from a client module are not readable on the
// server, which breaks the page during prerender.

export interface DonationTier {
  amount: number;
  title: string;
  description: string;
  tag?: string;
}

export const DONATION_TIERS: DonationTier[] = [
  {
    amount: 500,
    title: 'One School Kit',
    description:
      'A complete school kit for one child: notebooks, textbooks, stationery and a uniform set for a full academic year.',
    tag: 'Most chosen',
  },
  {
    amount: 1000,
    title: 'One Month of Tuition',
    description:
      'Covers tuition fees and study material for one child for one month at our Mehrauli learning centre.',
  },
  {
    amount: 2500,
    title: 'Three Months of Digital Learning',
    description:
      'Computer access, internet connectivity and digital literacy classes for one child for three months.',
  },
  {
    amount: 5000,
    title: 'Full Support for Three Months',
    description:
      'School kit, tuition, nutrition and digital access together for one child across a full quarter.',
    tag: 'Largest impact',
  },
];

export const MONTHLY_TIERS = [
  { amount: 250, label: '₹250/mo', note: 'Keeps one child supplied all year' },
  { amount: 500, label: '₹500/mo', note: 'Covers tuition and materials' },
  { amount: 1000, label: '₹1,000/mo', note: 'Full support, every month' },
];

export const FUND_ALLOCATION = [
  {
    pct: 65,
    label: 'Educational programmes',
    desc: 'School kits, tuition, books and learning material',
  },
  { pct: 15, label: 'Teacher training', desc: 'Training and development for classroom teachers' },
  { pct: 12, label: 'Infrastructure', desc: 'Classrooms, digital tools and equipment' },
  { pct: 8, label: 'Administration', desc: 'Programme management and operations' },
];

export const DONATION_FAQS = [
  {
    question: 'How do I donate online to Sunrise Children Educational Society?',
    answer:
      'Choose an amount on this page, click Donate now, and pay by UPI, debit card, credit card, net banking or wallet through Razorpay. Enter your name and email on the next step, then confirm the payment. The whole process takes about three minutes and your receipt is emailed within seven working days.',
  },
  {
    question: 'Is my donation eligible for tax benefit under Section 80G?',
    answer:
      'SCES issues 80G tax exemption receipts. Tick the 80G box while donating and provide your PAN and address, and we will email your certificate within seven working days. Under Section 80G you can claim a 50% deduction on the donated amount, provided you file your return under the old tax regime. The benefit is not available under the new regime.',
  },
  {
    question: 'What does my donation actually pay for?',
    answer:
      '65% of every rupee goes to educational programmes, including school kits, textbooks, tuition and learning material. 15% funds teacher training, 12% covers classroom and digital infrastructure, and 8% goes to administration. All of it is spent on children in and around Mehrauli, New Delhi.',
  },
  {
    question: 'What is the minimum donation amount?',
    answer:
      'The minimum online donation is ₹100 and the maximum per transaction is ₹5,00,000. Most donors choose ₹500 for a school kit, ₹1,000 for a month of tuition, ₹2,500 for three months of digital learning, or ₹5,000 for a full quarter of support.',
  },
  {
    question: 'Can I donate every month instead of once?',
    answer:
      'Yes. Switch to the monthly option and choose ₹250, ₹500 or ₹1,000 a month, or enter your own amount. A recurring gift lets us plan a full academic year for a child instead of resuming fundraising every quarter. You can stop or change a recurring donation by emailing info@scesindia.com.',
  },
  {
    question: 'Is donating on this website safe?',
    answer:
      'Payments are processed by Razorpay, a PCI-DSS compliant payment gateway used by thousands of Indian organisations. Your card or UPI credentials are entered on Razorpay secure infrastructure and are never stored on our servers. We only receive a confirmation that the payment succeeded.',
  },
  {
    question: 'Can I get a receipt for my donation?',
    answer:
      'Every donor receives an emailed receipt with a transaction reference and receipt number. If you asked for an 80G certificate, the same email thread carries your tax exemption certificate showing your name, PAN and the donated amount.',
  },
  {
    question: 'Can NRIs and foreign donors give to SCES?',
    answer:
      'Indian passport holders and OCI cardholders can donate using an Indian bank account or card through Razorpay. If you are donating from abroad and need an international card option or a wire transfer, email info@scesindia.com and we will share the correct process for your country and currency.',
  },
  {
    question: 'Can I choose what my donation is used for?',
    answer:
      'Yes. Your choice of amount maps to a specific outcome: a school kit, a month of tuition, digital learning access, or a full quarter of support. If you want to fund something specific such as a girl child education programme or a classroom, mention it when you email us and we will allocate it accordingly.',
  },
  {
    question: 'Can companies donate or set up CSR support?',
    answer:
      'Yes. SCES works with companies on CSR grants, employee giving and volunteering. Email info@scesindia.com with your organisation name and we will share our registration documents, audited accounts and programme reports for due diligence.',
  },
];

export const TRUST_POINTS = [
  { label: '80G tax exemption', detail: 'Certificate emailed in 7 working days' },
  { label: 'Secure payments', detail: 'PCI-DSS compliant Razorpay checkout' },
  { label: 'Transparent spending', detail: '65% straight to education programmes' },
  { label: 'Delhi based', detail: 'Mehrauli, New Delhi since 2020' },
];

export const HOW_TO_DONATE = [
  {
    name: 'Choose how much you want to give',
    text: 'Pick ₹500 for a school kit, ₹1,000 for a month of tuition, ₹2,500 for digital learning, ₹5,000 for a full quarter of support, or enter any amount above ₹100.',
  },
  {
    name: 'Enter your details',
    text: 'Add your name and email so the receipt reaches you. Tick the 80G box and add your PAN and address if you want the tax exemption certificate.',
  },
  {
    name: 'Pay securely',
    text: 'Pay by UPI, debit card, credit card, net banking or wallet through Razorpay. You are redirected to a confirmation page and the receipt is emailed within seven working days.',
  },
];
