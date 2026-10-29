import { ProcessStatusCode } from "../utils/enums/process-status-code.enum";

export interface FileExportInfo {
  file_upload_id: number;
  file_name: string;
  s3_key: string;
  upload_status: ProcessStatusCode;
  file_upload_type: string;
  presigned_url: string;
}
