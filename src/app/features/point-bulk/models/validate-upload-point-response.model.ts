export interface ValidateUploadPointResponse {
  valid: boolean;
  gap_rows: number[];
  invalid_rows: number[];
  not_found_rows: number[];
  blank_rows: number[];
  total_rows: number;
}
