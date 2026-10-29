import { PagedData } from '@app/shared/models/paged-data.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

export interface CustomerSegmentation {
  id: number;
  priority: number | null;
  segment_name: string;
  volume: number;
  status: StatusCode;
  created_date: string;
  updated_date: string;

  // fields for edit order
  pagePosition?: number;
  is_published: boolean;
  display_order: number | null;
}

export interface PagedCustomerSegmentations
  extends PagedData<CustomerSegmentation> {
  segmentId: number;
  lastPriority: number | null;
  lastDisplayOrder: number | null;
}

export interface CustomerSegmentationTable extends CustomerSegmentation {
  dragDisabled: boolean;
}

export interface CustomerSegmentationDetail {
  segment_id: number;
  segment_name: string;
  description: string;
  status: StatusCode;
  priority: number;
  job_finished: boolean;
  created_date: string;
  updated_date: string;
  created_by: string;
  updated_by: string;
  segment_users_volume: string;
  segment_group_list: SegmentGroup[];
}
