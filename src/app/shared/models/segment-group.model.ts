import { PartyIdFileInfo } from "@app/features/customer-segmentation/models/party-id-file-info.model";
import { SegmentationSourceCode } from "../utils/enums/segmentation-source-code.enum";

export interface SegmentGroup {
  id: number;
  priority: number | null;
  segment_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_date: string;
  updated_date: string;
  segment_rule_list: SegmentGroupRule[];
  segment_users_volume: number;
  segment_group_id?: number;
  segment_id?: number;
  group_name?: string;
  logical_operator?: string;
}

export interface SegmentGroupRule {
  segment_rule_id: number;
  segment_group_id: number;
  type: 'ROLLING' | 'FIXED';
  logical_operator: 'AND' | 'OR';
  attribute: string;
  rule_expression: string;
  rule_value: string;
  active_from_date?: string;
  active_to_date?: string;
  rule_code: string;
  segmentation_source?: SegmentationSourceCode;
  party_id_file_list?: PartyIdFileInfo[];
}
