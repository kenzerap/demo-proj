import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export interface OtpHistoriesQueryParams extends CommonListQueryParams {
  mobile_no: string;
}
