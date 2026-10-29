export interface ValidateUploadPartyIdResponse {
  success: boolean;
  file: {
    file_name: string;
    volume: number;
  };
  total_errors: number;
  errors: {
    type: string;
    rows?: number[];
  }[];
}
