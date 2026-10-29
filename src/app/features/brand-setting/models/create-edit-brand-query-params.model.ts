import { ExistingFormName } from '../utils/existing-form-name-code.enum';

export interface CreateEditBrandQueryParams {
  brand_name_english: string;
  brand_name_thai: string;
  brand_category_id: number;
  is_active: boolean;
  display_order: number;
  send_email_when_redeemed: boolean;
  to_email: string;
  cc_email: string;
  email_subject_english: string;
  email_subject_thai: string;
  email_body_english: string;
  email_body_thai: string;
  action_done_by: string;
  form_type_thai: ExistingFormName;
  form_type_english: ExistingFormName;
}
