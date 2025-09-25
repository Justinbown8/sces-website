import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('POST request received');
  
  try {
    const body = await request.json();
    console.log('Volunteer application data:', body);
    
    // Create Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        availability: body.availability,
        skills: body.skills,
        message: body.message,
        agreed_to_terms: body.agreedToTerms
      })
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database error: ${error.message}`,
          error: error
        },
        { status: 500 }
      );
    }
    
    console.log('Application saved successfully:', data);
    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        data: data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process application',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Volunteer API is working' });
}