import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

export interface ReorderHospitalQueryParams {
  items: {
    id: number;
    display_order: number | null;
    is_published: boolean;
  }[];
}
