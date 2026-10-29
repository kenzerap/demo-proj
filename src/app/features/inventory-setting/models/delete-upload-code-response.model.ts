import { LinkedPrivileges } from './linked-privileges.model';
import { UploadCode } from './upload-code.model';

export interface DeleteUploadCodeResponse {
  deleted: boolean;
  upload_code_list: UploadCode[];
  linked_privileges: LinkedPrivileges[];
}
