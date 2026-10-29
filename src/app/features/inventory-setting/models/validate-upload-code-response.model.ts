export interface ValidateUploadCodeResponse {
  valid: boolean;
  gap_rows: number[];
  duplicated_rows: number[];
  invalid_rows: number[];
  total_rows: number;
}
