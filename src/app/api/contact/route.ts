import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Contact form submission:', body);
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Save to Supabase contact_messages table
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || 'General Inquiry',
        message: body.message,
        newsletter_signup: body.newsletter || false
      })
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: `Database error: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log('Contact message saved:', data);
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}