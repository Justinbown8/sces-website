import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
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
        { success: false, message: 'Failed to submit application' },
        { status: 500 }
      );
    }
    
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