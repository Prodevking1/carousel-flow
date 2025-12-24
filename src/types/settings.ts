export type CoverAlignment = 'centered' | 'start';
export type SignaturePosition = 'bottom-right' | 'bottom-left';
export type ContentStyle = 'split' | 'combined';
export type ContentAlignment = 'centered' | 'start';

export interface UserSettings {
  id: string;
  user_id: string;
  primary_color: string;
  show_signature: boolean;
  signature_name: string;
  cover_alignment: CoverAlignment;
  signature_position: SignaturePosition;
  content_style: ContentStyle;
  show_slide_numbers: boolean;
  content_alignment: ContentAlignment;
  end_page_title: string;
  end_page_subtitle: string;
  end_page_cta: string;
  end_page_contact: string;
  end_page_image?: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsFormData {
  primary_color: string;
  show_signature: boolean;
  signature_name: string;
  cover_alignment: CoverAlignment;
  signature_position: SignaturePosition;
  content_style: ContentStyle;
  show_slide_numbers: boolean;
  content_alignment: ContentAlignment;
  end_page_title: string;
  end_page_subtitle: string;
  end_page_cta: string;
  end_page_contact: string;
  end_page_image?: string;
}
