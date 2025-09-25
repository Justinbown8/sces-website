import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('POST request received');
  
  try {
    const body = await request.json();
    console.log('Volunteer application data:', body);
    
    // For now, just return success without database
    return NextResponse.json(
      { 
        success: true, 
        message: 'Application received successfully',
        data: body
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process application',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Volunteer API is working' });
}