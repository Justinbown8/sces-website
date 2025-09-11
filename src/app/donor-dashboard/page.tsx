import { Metadata } from 'next';
import DonorDashboard from '@/components/donation/DonorDashboard';

export const metadata: Metadata = {
  title: 'Donor Dashboard - Track Your Impact | SCES',
  description: 'View your donation history and track the impact of your contributions to Sunrise Children Educational Society.',
};

export default function DonorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor Dashboard</h1>
          <p className="text-gray-600">
            Track your donations and see the impact of your contributions to children&apos;s education.
          </p>
        </div>
        
        <DonorDashboard />
      </div>
    </div>
  );
}