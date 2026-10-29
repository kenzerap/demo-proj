import { PartyIdFileInfo } from './party-id-file-info.model';

export interface UploadPartyIdResponse {
  success: boolean;
  file: PartyIdFileInfo;
}
