import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just return success - we'll add Supabase later
    console.log('Volunteer application received:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}