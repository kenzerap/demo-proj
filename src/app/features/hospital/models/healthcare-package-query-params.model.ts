import { CommonListQueryParams } from '@app/shared/models/common-list-query-params.model';

export interface HealthcarePackageQueryParams extends CommonListQueryParams {
    is_published: boolean;
}
