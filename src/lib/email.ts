// Email utility functions for donation receipts and notifications

import { formatCurrency } from './payment';

export interface DonationReceiptData {
  transactionId: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  recurring: boolean;
  frequency?: string;
  paymentMethod: string;
  timestamp: string;
  receiptNumber: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Volunteer application email types and functions
export interface VolunteerApplicationData {
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  availability: string;
  skills: string[];
  message: string;
  timestamp: string;
  ip?: string;
}

// Generate volunteer confirmation email template
export function generateVolunteerConfirmationEmail(data: VolunteerApplicationData): EmailTemplate {
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const subject = `Thank you for your volunteer application - SCES`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer Application Confirmation - SCES</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 8px;
        }
        .welcome {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .welcome h1 {
            color: #1e40af;
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .application-id {
            background: #f0fdf4;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin: 20px 0;
            border-left: 4px solid #22c55e;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .details-table th,
        .details-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .details-table th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #374151;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌅 SCES</div>
            <div>Sunrise Children Educational Society</div>
        </div>
        
        <div class="welcome">
            <h1>Welcome to the SCES Volunteer Family!</h1>
            <p>Thank you for your interest in volunteering with us. Your application has been received.</p>
        </div>
        
        <div class="application-id">
            <strong>Application ID: ${data.applicationId}</strong>
            <br><small>Please keep this ID for your records</small>
        </div>
        
        <table class="details-table">
            <tr><th>Name</th><td>${data.name}</td></tr>
            <tr><th>Email</th><td>${data.email}</td></tr>
            <tr><th>Phone</th><td>${data.phone}</td></tr>
            <tr><th>City</th><td>${data.city}</td></tr>
            <tr><th>Availability</th><td>${data.availability}</td></tr>
            <tr><th>Skills</th><td>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </td></tr>
            <tr><th>Application Date</th><td>${formattedDate}</td></tr>
        </table>
        
        <div class="footer">
            <strong>Questions? We're here to help!</strong><br>
            Phone: 099536 65620<br>
            Email: volunteer@sces.org<br><br>
            
            <strong>Sunrise Children Educational Society</strong><br>
            877/10 Ward No. 6, Mehrauli<br>
            New Delhi – 110030<br><br>
            
            <em>This is an automated email. For questions, please contact us using the information above.</em>
        </div>
    </div>
</body>
</html>`;

  const text = `
VOLUNTEER APPLICATION CONFIRMATION - SUNRISE CHILDREN EDUCATIONAL SOCIETY

Welcome to the SCES Volunteer Family!

Application ID: ${data.applicationId}

APPLICATION DETAILS:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
City: ${data.city}
Availability: ${data.availability}
Skills: ${data.skills.join(', ')}
Application Date: ${formattedDate}

CONTACT INFORMATION:
Phone: 099536 65620
Email: volunteer@sces.org

Sunrise Children Educational Society
877/10 Ward No. 6, Mehrauli
New Delhi – 110030

This is an automated email. For questions, please contact us using the information above.
`;

  return { subject, html, text };
}

// Generate admin notification email for new volunteer applications
export function generateVolunteerAdminNotificationEmail(data: VolunteerApplicationData): EmailTemplate {
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const subject = `New Volunteer Application - ${data.name} from ${data.city}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Volunteer Application</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8fafc; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .details table { width: 100%; }
        .details td { padding: 8px 0; vertical-align: top; }
        .skills { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill { background: #e0e7ff; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
        .message-box { background: #f9fafb; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0; }
        .urgent { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🆕 New Volunteer Application</h1>
        </div>
        <div class="content">
            <div class="highlight">
                <h2 style="margin: 0; color: #1e40af;">${data.name}</h2>
                <p style="margin: 5px 0; color: #64748b;">Application ID: ${data.applicationId}</p>
                <p style="margin: 5px 0; color: #64748b;">Submitted: ${formattedDate}</p>
            </div>
            
            <div class="details">
                <h3 style="margin-top: 0;">Contact Information</h3>
                <table>
                    <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                    <tr><td><strong>Phone:</strong></td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
                    <tr><td><strong>City:</strong></td><td>${data.city}</td></tr>
                    <tr><td><strong>Availability:</strong></td><td>${data.availability}</td></tr>
                </table>
            </div>
            
            <div class="details">
                <h3 style="margin-top: 0;">Skills & Interests</h3>
                <div class="skills">
                    ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="message-box">
                <h3 style="margin-top: 0;">Volunteer Message</h3>
                <p style="font-style: italic;">"${data.message}"</p>
            </div>
            
            <div class="highlight">
                <p class="urgent">⚡ Action Required: Please review and contact the volunteer within 3-5 business days.</p>
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
NEW VOLUNTEER APPLICATION RECEIVED

Name: ${data.name}
Application ID: ${data.applicationId}
Submitted: ${formattedDate}

CONTACT INFORMATION:
Email: ${data.email}
Phone: ${data.phone}
City: ${data.city}
Availability: ${data.availability}

SKILLS & INTERESTS:
${data.skills.join(', ')}

VOLUNTEER MESSAGE:
"${data.message}"

⚡ ACTION REQUIRED: Please review and contact the volunteer within 3-5 business days.
`;

  return { subject, html, text };
}

// Send volunteer confirmation email
export async function sendVolunteerConfirmationEmail(data: VolunteerApplicationData): Promise<{ success: boolean; error?: string }> {
  try {
    const template = generateVolunteerConfirmationEmail(data);
    
    console.log('Sending volunteer confirmation email:', {
      to: data.email,
      subject: template.subject,
      applicationId: data.applicationId,
    });
    
    // Mock email sending - replace with actual email service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send volunteer confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send confirmation email' 
    };
  }
}

// Send volunteer admin notification
export async function sendVolunteerAdminNotification(data: VolunteerApplicationData): Promise<{ success: boolean; error?: string }> {
  try {
    const template = generateVolunteerAdminNotificationEmail(data);
    
    // In production, send to admin email addresses
    const adminEmails = ['admin@sces.org', 'volunteer@sces.org'];
    
    console.log('Sending volunteer admin notification:', {
      to: adminEmails,
      subject: template.subject,
      applicationId: data.applicationId,
    });
    
    // Mock email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send volunteer admin notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send admin notification' 
    };
  }
}
// Generate donation receipt email template
export function generateDonationReceiptEmail(data: DonationReceiptData): EmailTemplate {
  const formattedAmount = formatCurrency(data.amount, data.currency);
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const subject = `Thank you for your donation - Receipt #${data.receiptNumber}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt - SCES</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 8px;
        }
        .thank-you {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .thank-you h1 {
            color: #92400e;
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            text-align: center;
            margin: 20px 0;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .details-table th,
        .details-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .details-table th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #374151;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌅 SCES</div>
            <div>Sunrise Children Educational Society</div>
        </div>
        
        <div class="thank-you">
            <h1>Thank You for Your Generous Donation!</h1>
            <p>Your contribution will help provide educational opportunities to children in need.</p>
        </div>
        
        <div class="amount">
            ${formattedAmount}
            ${data.recurring ? `<div style="font-size: 16px; color: #64748b; margin-top: 5px;">per ${data.frequency?.replace('ly', '') || 'month'}</div>` : ''}
        </div>
        
        <table class="details-table">
            <tr><th>Receipt Number</th><td>${data.receiptNumber}</td></tr>
            <tr><th>Transaction ID</th><td>${data.transactionId}</td></tr>
            <tr><th>Donor Name</th><td>${data.donorName}</td></tr>
            <tr><th>Email</th><td>${data.donorEmail}</td></tr>
            <tr><th>Amount</th><td>${formattedAmount}</td></tr>
            <tr><th>Donation Type</th><td>${data.recurring ? `Recurring (${data.frequency})` : 'One-time'}</td></tr>
            <tr><th>Payment Method</th><td style="text-transform: capitalize;">${data.paymentMethod}</td></tr>
            <tr><th>Date</th><td>${formattedDate}</td></tr>
        </table>
        
        <div class="footer">
            <strong>Sunrise Children Educational Society</strong><br>
            877/10 Ward No. 6, Mehrauli<br>
            New Delhi – 110030<br>
            Phone: 099536 65620<br><br>
            
            <em>This is an automated email. Please do not reply to this message.</em>
        </div>
    </div>
</body>
</html>`;

  const text = `
DONATION RECEIPT - SUNRISE CHILDREN EDUCATIONAL SOCIETY

Thank you for your generous donation!

Receipt Number: ${data.receiptNumber}
Transaction ID: ${data.transactionId}
Donor: ${data.donorName}
Email: ${data.donorEmail}
Amount: ${formattedAmount}
Type: ${data.recurring ? `Recurring (${data.frequency})` : 'One-time'}
Payment Method: ${data.paymentMethod}
Date: ${formattedDate}

CONTACT INFORMATION:
Sunrise Children Educational Society
877/10 Ward No. 6, Mehrauli
New Delhi – 110030
Phone: 099536 65620

This is an automated email. Please do not reply to this message.
`;

  return { subject, html, text };
}

// Email sending function (mock implementation - in production, integrate with email service)
export async function sendDonationReceipt(data: DonationReceiptData): Promise<{ success: boolean; error?: string }> {
  try {
    const template = generateDonationReceiptEmail(data);
    
    console.log('Sending donation receipt email:', {
      to: data.donorEmail,
      subject: template.subject,
      receiptNumber: data.receiptNumber,
    });
    
    // Mock email sending - replace with actual email service
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send donation receipt:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email receipt' 
    };
  }
}

// Generate admin notification email for new donations
export function generateAdminNotificationEmail(data: DonationReceiptData): EmailTemplate {
  const formattedAmount = formatCurrency(data.amount, data.currency);
  const formattedDate = new Date(data.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const subject = `New Donation Received - ${formattedAmount} from ${data.donorName}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Donation Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8fafc; }
        .amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .details table { width: 100%; }
        .details td { padding: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Donation Received</h1>
        </div>
        <div class="content">
            <div class="amount">${formattedAmount}</div>
            <div class="details">
                <table>
                    <tr><td><strong>Receipt Number:</strong></td><td>${data.receiptNumber}</td></tr>
                    <tr><td><strong>Transaction ID:</strong></td><td>${data.transactionId}</td></tr>
                    <tr><td><strong>Donor:</strong></td><td>${data.donorName}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${data.donorEmail}</td></tr>
                    <tr><td><strong>Type:</strong></td><td>${data.recurring ? `Recurring (${data.frequency})` : 'One-time'}</td></tr>
                    <tr><td><strong>Payment Method:</strong></td><td style="text-transform: capitalize;">${data.paymentMethod}</td></tr>
                    <tr><td><strong>Date:</strong></td><td>${formattedDate}</td></tr>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
NEW DONATION RECEIVED

Amount: ${formattedAmount}
Receipt Number: ${data.receiptNumber}
Transaction ID: ${data.transactionId}
Donor: ${data.donorName}
Email: ${data.donorEmail}
Type: ${data.recurring ? `Recurring (${data.frequency})` : 'One-time'}
Payment Method: ${data.paymentMethod}
Date: ${formattedDate}
`;

  return { subject, html, text };
}

// Send admin notification
export async function sendAdminNotification(data: DonationReceiptData): Promise<{ success: boolean; error?: string }> {
  try {
    const template = generateAdminNotificationEmail(data);
    
    // In production, send to admin email addresses
    const adminEmails = ['admin@sces.org', 'donations@sces.org'];
    
    console.log('Sending admin notification:', {
      to: adminEmails,
      subject: template.subject,
      receiptNumber: data.receiptNumber,
    });
    
    // Mock email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send admin notification' 
    };
  }
}