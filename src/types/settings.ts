export type DesignTemplate = 'template1' | 'template2';

export interface UserSettings {
  id: string;
  user_id: string;
  primary_color: string;
  show_signature: boolean;
  signature_name: string;
  design_template: DesignTemplate;
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
  design_template: DesignTemplate;
  end_page_title: string;
  end_page_subtitle: string;
  end_page_cta: string;
  end_page_contact: string;
  end_page_image?: string;
}
