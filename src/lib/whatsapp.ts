/**
 * WhatsApp Integration Utility
 * Handles sending WhatsApp notifications to users
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export interface WhatsAppMessage {
  phone: string;
  message: string;
  type?: 'text' | 'template';
}

/**
 * Send a text message via WhatsApp
 * @param phoneNumber - Recipient phone number (with country code, e.g., "919953665620")
 * @param message - Message text to send
 * @returns Promise with response data
 */
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
): Promise<any> {
  try {
    // Ensure phone number has country code
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }

    // If WhatsApp API credentials are not configured, log a message
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.log('WhatsApp API not configured. Message would be sent to:', formattedPhone);
      console.log('Message:', message);
      return {
        success: true,
        message: 'WhatsApp notification logged (API not configured)',
        mode: 'development'
      };
    }

    // Send message via WhatsApp API
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error:', error);
      throw new Error(`WhatsApp API error: ${error.message}`);
    }

    const data = await response.json();
    console.log('WhatsApp message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    // Don't throw - log the error but allow the main operation to continue
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a WhatsApp template message
 * @param phoneNumber - Recipient phone number
 * @param templateName - Name of the template
 * @param parameters - Template parameters
 * @returns Promise with response data
 */
export async function sendWhatsAppTemplate(
  phoneNumber: string,
  templateName: string,
  parameters?: string[]
): Promise<any> {
  try {
    // Ensure phone number has country code
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }

    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.log('WhatsApp API not configured. Template would be sent to:', formattedPhone);
      return {
        success: true,
        message: 'WhatsApp template notification logged (API not configured)',
        mode: 'development'
      };
    }

    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US',
          },
          ...(parameters && {
            components: [
              {
                type: 'body',
                parameters: parameters.map(p => ({ type: 'text', text: p })),
              },
            ],
          }),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error:', error);
      throw new Error(`WhatsApp API error: ${error.message}`);
    }

    const data = await response.json();
    console.log('WhatsApp template sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending WhatsApp template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format a message for WhatsApp (handles special formatting)
 * @param message - Raw message text
 * @returns Formatted message for WhatsApp
 */
export function formatWhatsAppMessage(message: string): string {
  return message
    .replace(/\*\*(.*?)\*\*/g, '*$1*') // Convert markdown bold to WhatsApp bold
    .replace(/__(.*?)__/g, '*$1*') // Convert markdown underline to WhatsApp bold
    .trim();
}
