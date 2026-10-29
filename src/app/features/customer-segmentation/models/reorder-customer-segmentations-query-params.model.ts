import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

export interface ReorderCustomerSegmentationsQueryParams {
  segments: {
    segment_id: number;
    priority: number | null;
    status: StatusCode;
  }[];
}
