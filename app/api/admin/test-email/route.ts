import { NextRequest, NextResponse } from 'next/server';
import { getEmailSettings } from '@/lib/email-settings';

export async function POST(request: NextRequest) {
  const { requireAdminSession } = await import('@/lib/admin-auth');
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { recipientEmail, orderType = 'quote' } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    const settings = await getEmailSettings();

    const subjectTemplate = orderType === 'quote'
      ? settings.email_subject_quote
      : settings.email_subject_order;
    const subject = subjectTemplate.replace('{orderNumber}', 'TEST-001');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#E88A00;padding:24px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;">Pepe's Mexican Restaurant</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Test ${orderType === 'quote' ? 'Quote' : 'Order'} Email</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#333;">This is a <strong>test email</strong> from the Pepe's admin settings panel.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#666;font-size:14px;">Order Number</td>
          <td style="padding:10px 0;text-align:right;font-weight:bold;color:#333;font-size:14px;">TEST-001</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#666;font-size:14px;">Type</td>
          <td style="padding:10px 0;text-align:right;font-weight:bold;color:#333;font-size:14px;">${orderType === 'quote' ? 'Quote' : 'Order'}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;color:#666;font-size:14px;">Customer</td>
          <td style="padding:10px 0;text-align:right;font-weight:bold;color:#333;font-size:14px;">Jane Smith</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;font-size:14px;">Total</td>
          <td style="padding:10px 0;text-align:right;font-weight:bold;color:#E88A00;font-size:16px;">$245.00</td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:13px;color:#999;">If you received this email, your notification settings are working correctly.</p>
    </div>
    <div style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">
      <p style="margin:0;">${settings.company_phone} &middot; ${settings.company_email}</p>
      <p style="margin:4px 0 0;">${settings.company_address}</p>
    </div>
  </div>
</body>
</html>`.trim();

    // Try Resend if API key is available, otherwise log to console
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: `Pepe's Mexican Restaurant <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: recipientEmail,
        subject,
        html,
        replyTo: settings.company_email,
      });
      console.log(`[test-email] Sent via Resend to ${recipientEmail}`);
    } else {
      console.log('[test-email] No RESEND_API_KEY set -- logging email to console');
      console.log('To:', recipientEmail);
      console.log('Subject:', subject);
      console.log('HTML length:', html.length, 'chars');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    );
  }
}
