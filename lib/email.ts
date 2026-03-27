import { Resend } from 'resend';
import { siteConfig } from './site-config';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  items: Array<{ title: string; displayText: string; totalPrice: number }>;
  headcount: number;
  subtotal: number;
  deliveryFee: number;
  orderTotal: number;
  perPerson: number;
  deliveryAddress: string;
  eventDate: string;
  eventTime: string;
  specialInstructions?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function buildOrderEmailHtml(data: OrderEmailData, isRestaurant: boolean): string {
  const itemRows = data.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong><br/>
        <span style="color: #666; font-size: 13px;">${item.displayText}</span>
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
        ${formatCurrency(item.totalPrice)}
      </td>
    </tr>
  `).join('');

  const heading = isRestaurant
    ? `New Catering Order #${data.orderNumber}`
    : `Thanks for Your Order, ${data.customerName}!`;

  const intro = isRestaurant
    ? `<p>A new catering order has been submitted. Please call the customer to confirm and take payment.</p>`
    : `<p>We've received your catering order request. We will call you shortly to confirm your order and take payment.</p>`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
      <div style="background: #E88A00; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${siteConfig.restaurant.name}</h1>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #8f260c; margin-top: 0;">${heading}</h2>
        ${intro}

        <h3 style="color: #8f260c; border-bottom: 2px solid #E88A00; padding-bottom: 8px;">Order #${data.orderNumber}</h3>

        ${isRestaurant ? `
        <div style="background: #fff3e0; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <strong>Customer:</strong> ${data.customerName}<br/>
          <strong>Phone:</strong> <a href="tel:${data.customerPhone}">${data.customerPhone}</a><br/>
          <strong>Email:</strong> ${data.customerEmail}<br/>
          ${data.company ? `<strong>Company:</strong> ${data.company}<br/>` : ''}
        </div>
        ` : ''}

        <table style="width: 100%; border-collapse: collapse;">
          ${itemRows}
        </table>

        <table style="width: 100%; margin-top: 16px;">
          <tr><td style="padding: 4px 0; color: #666;">Guests</td><td style="text-align: right;">${data.headcount}</td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Subtotal</td><td style="text-align: right;">${formatCurrency(data.subtotal)}</td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Delivery</td><td style="text-align: right;">${formatCurrency(data.deliveryFee)}</td></tr>
          <tr><td style="padding: 4px 0; color: #666;">Per Person</td><td style="text-align: right; color: #E88A00; font-weight: bold;">${formatCurrency(data.perPerson)}</td></tr>
          <tr style="border-top: 2px solid #E88A00;"><td style="padding: 8px 0; font-weight: bold; font-size: 18px;">Order Total</td><td style="text-align: right; font-weight: bold; font-size: 18px;">${formatCurrency(data.orderTotal)}</td></tr>
        </table>

        <h3 style="color: #8f260c; border-bottom: 2px solid #E88A00; padding-bottom: 8px; margin-top: 24px;">Event Details</h3>
        <p>
          <strong>Date:</strong> ${data.eventDate}<br/>
          <strong>Time:</strong> ${data.eventTime}<br/>
          <strong>Address:</strong> ${data.deliveryAddress}<br/>
          ${data.specialInstructions ? `<strong>Instructions:</strong> ${data.specialInstructions}` : ''}
        </p>

        ${!isRestaurant ? `
        <div style="background: #8f260c; color: white; padding: 16px; border-radius: 8px; margin-top: 24px; text-align: center;">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">We'll call you to confirm & take payment</p>
          <p style="margin: 8px 0 0; opacity: 0.8;">Questions? Call us at ${siteConfig.contact.phone}</p>
        </div>
        ` : ''}
      </div>
      <div style="background: #1A1A1A; color: #999; padding: 16px; text-align: center; font-size: 12px;">
        ${siteConfig.restaurant.name} &middot; ${siteConfig.contact.addressFull} &middot; ${siteConfig.contact.phone}
      </div>
    </div>
  `;
}

export async function sendOrderEmails(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log('Resend not configured — skipping emails. Order:', data.orderNumber);
    return { success: true };
  }

  try {
    // Send customer confirmation email
    await resend.emails.send({
      from: `${siteConfig.restaurant.name} <orders@${process.env.RESEND_DOMAIN || 'resend.dev'}>`,
      to: data.customerEmail,
      subject: `Order Received - #${data.orderNumber} | ${siteConfig.restaurant.name}`,
      html: buildOrderEmailHtml(data, false),
    });

    // Send restaurant notification email
    const restaurantEmail = siteConfig.contact.email || process.env.RESTAURANT_EMAIL;
    if (restaurantEmail) {
      await resend.emails.send({
        from: `${siteConfig.restaurant.name} Orders <orders@${process.env.RESEND_DOMAIN || 'resend.dev'}>`,
        to: restaurantEmail,
        subject: `🔔 New Catering Order #${data.orderNumber} - ${data.customerName}`,
        html: buildOrderEmailHtml(data, true),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send order emails:', error);
    return { success: false, error: String(error) };
  }
}
