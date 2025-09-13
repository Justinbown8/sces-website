import { NextRequest, NextResponse } from 'next/server';
import { 
  calculateDonationStats, 
  getDonationTrends, 
  getDonorHistory,
  getDonationByTransaction,
  exportDonationData,
  validateDonationData
} from '@/lib/donation-tracking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const email = searchParams.get('email');
    const transactionId = searchParams.get('transaction_id');
    const period = searchParams.get('period') as 'month' | 'quarter' | 'year' | null;
    const format = searchParams.get('format') as 'csv' | 'json' | null;

    switch (action) {
      case 'stats': {
        // Calculate date range based on period
        let dateRange: { start: Date; end: Date } | undefined;
        const now = new Date();
        
        if (period === 'month') {
          dateRange = {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: now,
          };
        } else if (period === 'quarter') {
          const quarterStart = Math.floor(now.getMonth() / 3) * 3;
          dateRange = {
            start: new Date(now.getFullYear(), quarterStart, 1),
            end: now,
          };
        } else if (period === 'year') {
          dateRange = {
            start: new Date(now.getFullYear(), 0, 1),
            end: now,
          };
        }

        const stats = await calculateDonationStats(dateRange);
        return NextResponse.json(stats);
      }

      case 'trends': {
        const months = parseInt(searchParams.get('months') || '6');
        const trends = await getDonationTrends(months);
        return NextResponse.json(trends);
      }

      case 'donor_history': {
        if (!email) {
          return NextResponse.json(
            { error: 'Email parameter is required' },
            { status: 400 }
          );
        }
        const history = await getDonorHistory(email);
        return NextResponse.json(history);
      }

      case 'transaction': {
        if (!transactionId) {
          return NextResponse.json(
            { error: 'Transaction ID parameter is required' },
            { status: 400 }
          );
        }
        const donation = await getDonationByTransaction(transactionId);
        if (!donation) {
          return NextResponse.json(
            { error: 'Donation not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(donation);
      }

      case 'export': {
        const exportFormat = format || 'csv';
        const data = await exportDonationData(exportFormat);
        
        const headers = new Headers();
        if (exportFormat === 'csv') {
          headers.set('Content-Type', 'text/csv');
          headers.set('Content-Disposition', `attachment; filename="sces-donations-${new Date().toISOString().split('T')[0]}.csv"`);
        } else {
          headers.set('Content-Type', 'application/json');
          headers.set('Content-Disposition', `attachment; filename="sces-donations-${new Date().toISOString().split('T')[0]}.json"`);
        }
        
        return new NextResponse(data, { headers });
      }

      case 'validate': {
        const validation = await validateDonationData();
        return NextResponse.json(validation);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Donation tracking API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}