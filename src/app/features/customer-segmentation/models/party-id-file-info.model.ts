export interface PartyIdFileInfo {
  id: number;
  file_name: string;
  volume: number;
  status: string;
  imported_date: string;
  imported_by: string;
  segment_group_id?: number;
  segment_rule_id?: number;
  file_url?: string;
}
