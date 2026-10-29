import { StatusCode } from '@app/shared/utils/enums/status-code.enum';

export interface ReorderCheckupPackageQueryParams {
  items: {
    id: number;
    display_order: number | null;
    is_published: boolean;
  }[];
}
