export interface OtpHistory {
  otp_id: number;
  sender: string;
  otp_code: string;
  mobile_no: string;
  message: string;
  channel: string;
  error_code: string | null;
  error_message: string | null;
  created_date: string;
  updated_date: string;
}
