'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState, useCallback } from 'react';
import { 
  DonationStats, 
  MonthlyReport, 
  calculateDonationStats, 
  getDonationTrends,
  calculateImpactMetrics,
  exportDonationData
} from '@/lib/donation-tracking';
import { formatCurrency } from '@/lib/payment';

interface DonationTrackerProps {
  showExportOptions?: boolean;
  compact?: boolean;
}

export default function DonationTracker({ showExportOptions = false, compact = false }: DonationTrackerProps) {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [trends, setTrends] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadDonationData();
  }, [selectedPeriod, loadDonationData]);

  const loadDonationData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selected period
      const now = new Date();
      let dateRange: { start: Date; end: Date } | undefined;
      
      if (selectedPeriod === 'month') {
        dateRange = {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now,
        };
      } else if (selectedPeriod === 'quarter') {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        dateRange = {
          start: new Date(now.getFullYear(), quarterStart, 1),
          end: now,
        };
      } else {
        dateRange = {
          start: new Date(now.getFullYear(), 0, 1),
          end: now,
        };
      }

      const [statsData, trendsData] = await Promise.all([
        calculateDonationStats(dateRange),
        getDonationTrends(6), // Last 6 months
      ]);

      setStats(statsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Failed to load donation data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const data = await exportDonationData(format);
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sces-donations-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No donation data available</p>
      </Card>
    );
  }

  const impactMetrics = calculateImpactMetrics(stats.totalAmount);

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Donation Summary</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalDonations}
            </div>
            <div className="text-sm text-gray-600">Donations</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Analytics</h2>
            <p className="text-gray-600">Track donation performance and impact metrics</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            {showExportOptions && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('json')}
                >
                  Export JSON
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="text-sm text-green-700 font-medium">Total Raised</div>
            {stats.monthlyGrowth !== 0 && (
              <div className={`text-xs mt-1 ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth > 0 ? '↗' : '↘'} {Math.abs(stats.monthlyGrowth).toFixed(1)}% from last month
              </div>
            )}
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalDonations}
            </div>
            <div className="text-sm text-blue-700 font-medium">Total Donations</div>
            <div className="text-xs text-blue-600 mt-1">
              Avg: {formatCurrency(stats.averageDonation)}
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats.donorCount}
            </div>
            <div className="text-sm text-purple-700 font-medium">Unique Donors</div>
            <div className="text-xs text-purple-600 mt-1">
              {stats.recurringDonations} recurring
            </div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-1 capitalize">
              {stats.topPaymentMethod}
            </div>
            <div className="text-sm text-orange-700 font-medium">Top Payment Method</div>
            <div className="text-xs text-orange-600 mt-1">
              {((stats.recurringDonations / stats.totalDonations) * 100).toFixed(1)}% recurring
            </div>
          </div>
        </div>
      </Card>

      {/* Impact Metrics */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Generated</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-900">{impactMetrics.schoolKits}</div>
            <div className="text-sm text-gray-600">School Kits Provided</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🎓</div>
            <div className="text-2xl font-bold text-gray-900">{impactMetrics.monthsOfTuition}</div>
            <div className="text-sm text-gray-600">Months of Tuition</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">💻</div>
            <div className="text-2xl font-bold text-gray-900">{impactMetrics.digitalAccess}</div>
            <div className="text-sm text-gray-600">Digital Access Grants</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-gray-900">{impactMetrics.fullSponsorships}</div>
            <div className="text-sm text-gray-600">Full Sponsorships</div>
          </div>
        </div>
      </Card>

      {/* Trends Chart */}
      {trends.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Donation Trends (Last 6 Months)</h3>
          <div className="space-y-4">
            {trends.map((report) => {
              const maxAmount = Math.max(...trends.map(r => r.totalAmount));
              const widthPercentage = maxAmount > 0 ? (report.totalAmount / maxAmount) * 100 : 0;
              
              return (
                <div key={`${report.year}-${report.month}`} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600 font-medium">
                    {report.month.slice(0, 3)} {report.year}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(report.totalAmount)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {report.donationCount} donations
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}