'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DonationRecord, calculateImpactMetrics } from '@/lib/donation-tracking';
import { formatCurrency } from '@/lib/payment';

export default function DonorDashboard() {
  const [email, setEmail] = useState('');
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/donation/tracking?action=donor_history&email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch donation history');
      }
      
      const data = await response.json();
      setDonations(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load donation history');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const impactMetrics = calculateImpactMetrics(totalDonated);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Find Your Donations</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email used for donations"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </Card>

      {/* Results */}
      {searched && (
        <>
          {donations.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-gray-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donations Found</h3>
              <p className="text-gray-600">
                We couldn&apos;t find any donations associated with this email address.
                Please check the email and try again.
              </p>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(totalDonated)}
                  </div>
                  <div className="text-gray-600">Total Donated</div>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {donations.length}
                  </div>
                  <div className="text-gray-600">Donations Made</div>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {donations.filter(d => d.recurring).length}
                  </div>
                  <div className="text-gray-600">Recurring Donations</div>
                </Card>
              </div>

              {/* Impact Metrics */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Total Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-2xl font-bold text-blue-600">{impactMetrics.schoolKits}</div>
                    <div className="text-sm text-blue-700">School Kits</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="text-2xl font-bold text-green-600">{impactMetrics.monthsOfTuition}</div>
                    <div className="text-sm text-green-700">Months of Tuition</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">💻</div>
                    <div className="text-2xl font-bold text-purple-600">{impactMetrics.digitalAccess}</div>
                    <div className="text-sm text-purple-700">Digital Access</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl mb-2">🌟</div>
                    <div className="text-2xl font-bold text-orange-600">{impactMetrics.fullSponsorships}</div>
                    <div className="text-sm text-orange-700">Full Sponsorships</div>
                  </div>
                </div>
              </Card>

              {/* Donation History */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Donation History</h3>
                <div className="space-y-4">
                  {donations
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((donation) => (
                      <div
                        key={donation.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(donation.amount)}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                donation.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : donation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {donation.status}
                              </div>
                              {donation.recurring && (
                                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  Recurring ({donation.frequency})
                                </div>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Receipt: {donation.receiptNumber}</div>
                              <div>Transaction: {donation.transactionId}</div>
                              <div>Date: {new Date(donation.timestamp).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}</div>
                              <div className="capitalize">Payment: {donation.paymentMethod}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0 sm:ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // In a real implementation, this would generate and download a receipt
                                alert(`Receipt for ${donation.receiptNumber} would be downloaded here`);
                              }}
                            >
                              Download Receipt
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Thank You Message */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Your Support!</h3>
                  <p className="text-gray-700 mb-4">
                    Your generous contributions have made a real difference in the lives of children across India. 
                    Together, we&apos;re building a brighter future through education.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button as="a" href="/donate">
                      Make Another Donation
                    </Button>
                    <Button variant="outline" as="a" href="/volunteer">
                      Become a Volunteer
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}