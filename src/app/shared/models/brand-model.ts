export interface Brand {
  brand_id: number;
  brand_name_english: string;
  brand_name_thai: string;
  brand_logo: string;
  preview_brand_logo_url: string;
  brand_category_id: number;
  brand_category_name_english: string;
  brand_category_name_thai: string;
  is_active: boolean;
  display_order: number;
  send_email_when_redeemed: boolean;
  to_email: string;
  cc_email: string;
  email_subject_english: string;
  email_subject_thai: string;
  email_body_english: string;
  email_body_thai: string;
  form_type_english: string;
  form_type_thai: string;
  created_by: string;
  updated_by: string | null;
  created_date: string;
  updated_date: string;
}

export interface BrandDetail {
  brand_id: number;
  brand_name_english: string;
  brand_name_thai: string;
  brand_logo: string;
  preview_brand_logo_url: string;
  brand_category_id: number;
  brand_category_name_english: string;
  brand_category_name_thai: string;
  is_active: boolean;
  display_order: number;
  send_email_when_redeemed: boolean;
  to_email: string;
  cc_email: string;
  email_subject_english: string;
  email_subject_thai: string;
  email_body_english: string;
  email_body_thai: string;
  form_type_english: string;
  form_type_thai: string;
  created_by: string;
  updated_by: string;
  created_date: string;
  updated_date: string;
}
