// Donation tracking and reporting functionality

export interface DonationRecord {
  id: string;
  transactionId: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod: 'razorpay' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  averageDonation: number;
  recurringDonations: number;
  oneTimeDonations: number;
  topPaymentMethod: string;
  monthlyGrowth: number;
  donorCount: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalAmount: number;
  donationCount: number;
  newDonors: number;
  recurringAmount: number;
  oneTimeAmount: number;
  averageDonation: number;
}

// Mock database - in production, use a real database
class DonationDatabase {
  private donations: DonationRecord[] = [];
  private storageKey = 'sces_donations';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.donations = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load donations from storage:', error);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.donations));
      } catch (error) {
        console.error('Failed to save donations to storage:', error);
      }
    }
  }

  async addDonation(donation: Omit<DonationRecord, 'id'>): Promise<DonationRecord> {
    const record: DonationRecord = {
      ...donation,
      id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.donations.push(record);
    this.saveToStorage();
    
    return record;
  }

  async getDonation(id: string): Promise<DonationRecord | null> {
    return this.donations.find(d => d.id === id) || null;
  }

  async getDonationByTransaction(transactionId: string): Promise<DonationRecord | null> {
    return this.donations.find(d => d.transactionId === transactionId) || null;
  }

  async getDonationsByEmail(email: string): Promise<DonationRecord[]> {
    return this.donations.filter(d => d.donorEmail.toLowerCase() === email.toLowerCase());
  }

  async getAllDonations(): Promise<DonationRecord[]> {
    return [...this.donations];
  }

  async updateDonationStatus(id: string, status: DonationRecord['status']): Promise<boolean> {
    const donation = this.donations.find(d => d.id === id);
    if (donation) {
      donation.status = status;
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

// Singleton instance
const donationDB = new DonationDatabase();

// Public API functions
export async function recordDonation(data: {
  transactionId: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod: 'razorpay' | 'paypal';
  metadata?: Record<string, unknown>;
}): Promise<DonationRecord> {
  return await donationDB.addDonation({
    ...data,
    status: 'completed',
    timestamp: new Date().toISOString(),
  });
}

export async function getDonationByTransaction(transactionId: string): Promise<DonationRecord | null> {
  return await donationDB.getDonationByTransaction(transactionId);
}

export async function getDonorHistory(email: string): Promise<DonationRecord[]> {
  return await donationDB.getDonationsByEmail(email);
}

export async function calculateDonationStats(dateRange?: { start: Date; end: Date }): Promise<DonationStats> {
  const donations = await donationDB.getAllDonations();
  
  let filteredDonations = donations.filter(d => d.status === 'completed');
  
  if (dateRange) {
    filteredDonations = filteredDonations.filter(d => {
      const donationDate = new Date(d.timestamp);
      return donationDate >= dateRange.start && donationDate <= dateRange.end;
    });
  }

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const recurringDonations = filteredDonations.filter(d => d.recurring).length;
  const oneTimeDonations = filteredDonations.length - recurringDonations;
  
  // Calculate payment method usage
  const paymentMethods = filteredDonations.reduce((acc, d) => {
    acc[d.paymentMethod] = (acc[d.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topPaymentMethod = Object.entries(paymentMethods)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'razorpay';

  // Calculate monthly growth (simplified)
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const lastMonthDonations = filteredDonations.filter(d => {
    const date = new Date(d.timestamp);
    return date >= lastMonth && date < thisMonth;
  });
  
  const thisMonthDonations = filteredDonations.filter(d => {
    const date = new Date(d.timestamp);
    return date >= thisMonth;
  });
  
  const lastMonthAmount = lastMonthDonations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonthAmount = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);
  
  const monthlyGrowth = lastMonthAmount > 0 
    ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
    : 0;

  // Count unique donors
  const uniqueDonors = new Set(filteredDonations.map(d => d.donorEmail.toLowerCase())).size;

  return {
    totalDonations: filteredDonations.length,
    totalAmount,
    averageDonation: filteredDonations.length > 0 ? totalAmount / filteredDonations.length : 0,
    recurringDonations,
    oneTimeDonations,
    topPaymentMethod,
    monthlyGrowth,
    donorCount: uniqueDonors,
  };
}

export async function generateMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
  const donations = await donationDB.getAllDonations();
  
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59);
  
  const monthDonations = donations.filter(d => {
    if (d.status !== 'completed') return false;
    const date = new Date(d.timestamp);
    return date >= monthStart && date <= monthEnd;
  });

  const totalAmount = monthDonations.reduce((sum, d) => sum + d.amount, 0);
  const recurringAmount = monthDonations
    .filter(d => d.recurring)
    .reduce((sum, d) => sum + d.amount, 0);
  const oneTimeAmount = totalAmount - recurringAmount;

  // Count new donors (first-time donors in this month)
  const allDonorEmails = new Set(
    donations
      .filter(d => d.status === 'completed' && new Date(d.timestamp) < monthStart)
      .map(d => d.donorEmail.toLowerCase())
  );
  
  const newDonors = monthDonations.filter(d => 
    !allDonorEmails.has(d.donorEmail.toLowerCase())
  ).length;

  return {
    month: monthStart.toLocaleDateString('en-US', { month: 'long' }),
    year,
    totalAmount,
    donationCount: monthDonations.length,
    newDonors,
    recurringAmount,
    oneTimeAmount,
    averageDonation: monthDonations.length > 0 ? totalAmount / monthDonations.length : 0,
  };
}

export async function getDonationTrends(months: number = 12): Promise<MonthlyReport[]> {
  const reports: MonthlyReport[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const report = await generateMonthlyReport(date.getFullYear(), date.getMonth() + 1);
    reports.push(report);
  }
  
  return reports;
}

// Impact calculation based on donation amounts
export function calculateImpactMetrics(totalAmount: number): {
  schoolKits: number;
  monthsOfTuition: number;
  digitalAccess: number;
  fullSponsorships: number;
} {
  return {
    schoolKits: Math.floor(totalAmount / 500),
    monthsOfTuition: Math.floor(totalAmount / 1000),
    digitalAccess: Math.floor(totalAmount / 2500),
    fullSponsorships: Math.floor(totalAmount / 5000),
  };
}

// Export donation data for reporting
export async function exportDonationData(format: 'csv' | 'json' = 'csv'): Promise<string> {
  const donations = await donationDB.getAllDonations();
  
  if (format === 'json') {
    return JSON.stringify(donations, null, 2);
  }
  
  // CSV format
  const headers = [
    'ID',
    'Transaction ID',
    'Receipt Number',
    'Amount',
    'Currency',
    'Donor Name',
    'Donor Email',
    'Recurring',
    'Frequency',
    'Payment Method',
    'Status',
    'Date',
  ];
  
  const rows = donations.map(d => [
    d.id,
    d.transactionId,
    d.receiptNumber,
    d.amount.toString(),
    d.currency,
    d.donorName,
    d.donorEmail,
    d.recurring ? 'Yes' : 'No',
    d.frequency || '',
    d.paymentMethod,
    d.status,
    new Date(d.timestamp).toLocaleDateString(),
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}

// Validate donation data integrity
export async function validateDonationData(): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const donations = await donationDB.getAllDonations();
  const errors: string[] = [];
  const warnings: string[] = [];
  
  donations.forEach((donation, index) => {
    // Check required fields
    if (!donation.transactionId) {
      errors.push(`Donation ${index + 1}: Missing transaction ID`);
    }
    if (!donation.donorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donation.donorEmail)) {
      errors.push(`Donation ${index + 1}: Invalid email address`);
    }
    if (donation.amount <= 0) {
      errors.push(`Donation ${index + 1}: Invalid amount`);
    }
    
    // Check for warnings
    if (donation.recurring && !donation.frequency) {
      warnings.push(`Donation ${index + 1}: Recurring donation without frequency`);
    }
    if (donation.amount > 100000) {
      warnings.push(`Donation ${index + 1}: Unusually large amount (₹${donation.amount})`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}