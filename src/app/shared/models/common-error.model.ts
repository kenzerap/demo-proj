export interface CommonError {
  error?: { errors: { error_code: string; message: string }[] };
  title?: string;
  status_code?: number;
}
