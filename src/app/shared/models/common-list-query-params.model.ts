import { SortDirection } from "@angular/material/sort";

export interface CommonListQueryParams {
  page: number;
  size: number;
  keyword: string;
  sort_field: string;
  sort_direction: SortDirection;
  sort_by: string;
}
