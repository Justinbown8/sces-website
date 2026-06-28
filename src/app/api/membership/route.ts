import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

interface MembershipData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  occupation: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  membershipType: 'annual' | 'lifetime' | 'student';
  agreeToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: MembershipData = await request.json();
    
    console.log('Membership registration:', body);
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'occupation', 'address', 'city', 'state', 'pincode', 'membershipType'
    ];
    
    for (const field of requiredFields) {
      if (!body[field as keyof MembershipData]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(body.pincode)) {
      return NextResponse.json(
        { success: false, message: 'Invalid pincode' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert membership data into Supabase
    const { data, error } = await supabase
      .from('memberships')
      .insert([
        {
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          phone: body.phone,
          date_of_birth: body.dateOfBirth,
          occupation: body.occupation,
          address: body.address,
          city: body.city,
          state: body.state,
          pincode: body.pincode,
          membership_type: body.membershipType,
          status: 'active',
          created_at: new Date().toISOString(),
          registration_ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insertion error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to register membership. Please try again.' },
        { status: 500 }
      );
    }

    // Send WhatsApp notification
    try {
      const whatsappMessage = `Hello ${body.firstName} ${body.lastName}! 👋

Welcome to SCES Membership! 🎉

Your membership has been successfully registered.

📋 Registration Details:
• Membership Type: ${body.membershipType.toUpperCase()}
• Phone: ${body.phone}
• Email: ${body.email}

You will receive detailed information about your membership benefits shortly.

Thank you for supporting children's education! 📚

For any queries, contact us at: info@scesindia.com`;

      await sendWhatsAppNotification(body.phone, whatsappMessage);
    } catch (whatsappError) {
      console.error('WhatsApp notification error:', whatsappError);
      // Don't fail the entire request if WhatsApp notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Membership registered successfully! You will receive a WhatsApp confirmation shortly.',
      data: data
    });
    
  } catch (error) {
    console.error('Membership registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register membership. Please try again.' },
      { status: 500 }
    );
  }
}
