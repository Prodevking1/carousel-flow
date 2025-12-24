import { supabase } from '../lib/supabase';
import { UserSettings, SettingsFormData } from '../types/settings';

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }

  return data;
}

export async function getOrCreateUserSettings(userId: string): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      primary_color: '#0A66C2',
      show_signature: false,
      signature_name: '',
      cover_alignment: 'centered',
      signature_position: 'bottom-right',
      content_style: 'split',
      show_slide_numbers: true,
      content_alignment: 'centered',
      end_page_title: 'Your Name',
      end_page_subtitle: 'Follow me for more content',
      end_page_cta: 'Follow for more content',
      end_page_contact: '',
      end_page_image: ''
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user settings:', error);
    throw error;
  }

  return data;
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<SettingsFormData>
): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }

  return data;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

export function generateGradient(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return `linear-gradient(135deg, ${color}, ${color})`;

  const lighterR = Math.min(255, rgb.r + 40);
  const lighterG = Math.min(255, rgb.g + 40);
  const lighterB = Math.min(255, rgb.b + 40);

  const darkerR = Math.max(0, rgb.r - 40);
  const darkerG = Math.max(0, rgb.g - 40);
  const darkerB = Math.max(0, rgb.b - 40);

  return `linear-gradient(135deg, rgb(${lighterR}, ${lighterG}, ${lighterB}), ${color}, rgb(${darkerR}, ${darkerG}, ${darkerB}))`;
}
