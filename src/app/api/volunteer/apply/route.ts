import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const body = await request.json();
    console.log('Received volunteer application:', body);
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400, headers }
      );
    }

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
        { success: false, message: `Database error: ${error.message}` },
        { status: 500, headers }
      );
    }
    
    console.log('Application saved successfully:', data);
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    }, { headers });
  } catch (error) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { success: false, message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}