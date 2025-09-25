import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received volunteer application:', body);
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client directly
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
      });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: `Database error: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log('Application saved successfully:', data);
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { success: false, message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}