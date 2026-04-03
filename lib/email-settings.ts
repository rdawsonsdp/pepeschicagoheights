import { supabase } from './supabase';

export interface EmailSettings {
  email_enabled: boolean;
  email_subject_quote: string;
  email_subject_order: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  notification_emails: string;
}

const DEFAULTS: EmailSettings = {
  email_enabled: true,
  email_subject_quote: "Your Catering Quote #{orderNumber} — Pepe's Mexican Restaurant",
  email_subject_order: "Your Catering Order #{orderNumber} — Pepe's Mexican Restaurant",
  company_phone: '(708) 748-2400',
  company_email: 'orders@pepesmexican.com',
  company_address: '470 W Lincoln Hwy, Chicago Heights, IL 60411',
  notification_emails: '',
};

let localEmailSettings: EmailSettings = { ...DEFAULTS };

export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'email_settings')
      .single();

    if (error || !data) return localEmailSettings;
    const merged = { ...DEFAULTS, ...(data.value as Partial<EmailSettings>) };
    localEmailSettings = merged;
    return merged;
  } catch {
    return localEmailSettings;
  }
}

export async function setEmailSettings(settings: Partial<EmailSettings>): Promise<void> {
  const current = await getEmailSettings();
  const merged = { ...current, ...settings };
  try {
    const { error } = await supabase
      .from('settings')
      .upsert(
        { key: 'email_settings', value: merged, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) throw error;
    localEmailSettings = merged;
  } catch {
    localEmailSettings = merged;
  }
}

export function getDefaultEmailSettings(): EmailSettings {
  return { ...DEFAULTS };
}
