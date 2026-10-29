import { createAction, props } from '@ngrx/store';
import { CommonError } from '@app/shared/models/common-error.model';
import { ToastMessageData } from '@app/shared/models/toast-message-data.model';
import { TierGroup } from '@app/shared/models/tier-group.model';
import { PagedData } from '@app/shared/models/paged-data.model';
import { SegmentGroup } from '@app/shared/models/segment-group.model';
import { TierSegmentIncludeExclude } from '@app/shared/models/tier-segment-include-exclude.model';
import { BrandCommon } from '@app/features/inventory-setting/models/brand-common.model';
import { CreateEditPrivilegesQueryParams } from '../../models/create-edit-privilege-query-params.model';
import { HealthcarePackage } from '../../models/healthcare-package.model';
import { InventoriesQueryParams } from '@app/shared/models/inventories-query-params.model';
import { Inventory } from '@app/shared/models/inventory-model';
import { PrivilegeDetail } from '../../models/privilege-setting-model';

const prefix = '[Create Edit Privilege]';

export const createPrivilege = createAction(
  `${prefix} Create Privilege | loadingKey=createEditPrivilege`,
  props<{
    queryParams: Partial<CreateEditPrivilegesQueryParams>;
    thumbnailFile: File | null;
    detailFile: File | null;
  }>()
);

export const createPrivilegeSuccess = createAction(
  `${prefix} Create Privilege Success | loadingKey=createEditPrivilege`,
  props<{ isPublished: boolean }>()
);

export const createPrivilegeFailure = createAction(
  `${prefix} Create Privilege Failure | loadingKey=createEditPrivilege`,
  props<{ messageData: ToastMessageData }>()
);

export const getBrandOptions = createAction(
  `${prefix} Get Brands Options | loadingKey=getBrandOptions`
);

export const getBrandOptionsSuccess = createAction(
  `${prefix} Get Brands Options Success | loadingKey=getBrandOptions`,
  props<{ data: BrandCommon[] }>()
);

export const getBrandOptionsFailure = createAction(
  `${prefix} Get Brands Options Failure | loadingKey=getBrandOptions`,
  props<{ error: CommonError }>()
);

export const getHealthcarePackageOptions = createAction(
  `${prefix} Get Healthcare Packages Options | loadingKey=getHealthcarePackageOptions`
);

export const getHealthcarePackageOptionsSuccess = createAction(
  `${prefix} Get Healthcare Packages Options Success | loadingKey=getHealthcarePackageOptions`,
  props<{ data: HealthcarePackage[] }>()
);

export const getHealthcarePackageOptionsFailure = createAction(
  `${prefix} Get Healthcare Packages Options Failure | loadingKey=getHealthcarePackageOptions`,
  props<{ error: CommonError }>()
);

export const getUploadCodeInventories = createAction(
  `${prefix} Get Upload Code Inventories | loadingKey=getUploadCodeInventories`,
  props<{ queryParams: Partial<InventoriesQueryParams> }>()
);

export const getUploadCodeInventoriesSuccess = createAction(
  `${prefix} Get Upload Code Inventories Success | loadingKey=getUploadCodeInventories`,
  props<{ pagedData: PagedData<Inventory> }>()
);

export const getUploadCodeInventoriesFailure = createAction(
  `${prefix} Get Upload Code Inventories Failure | loadingKey=getUploadCodeInventories`,
  props<{ error: CommonError }>()
);

export const getProductInventories = createAction(
  `${prefix} Get Product Inventories | loadingKey=getProductInventories`,
  props<{ queryParams: Partial<InventoriesQueryParams> }>()
);

export const getProductInventoriesSuccess = createAction(
  `${prefix} Get Product Inventories Success | loadingKey=getProductInventories`,
  props<{ pagedData: PagedData<Inventory> }>()
);

export const getProductInventoriesFailure = createAction(
  `${prefix} Get Product Inventories Failure | loadingKey=getProductInventories`,
  props<{ error: CommonError }>()
);

export const setFormDirty = createAction(
  `${prefix} Set Edit Form Dirty`,
  props<{ isDirty: boolean }>()
);

export const getPrivilegeDetail = createAction(
  `${prefix} Get Privilege Detail | loadingKey=getPrivilegeDetail`,
  props<{ privilegeId: number }>()
);

export const getPrivilegeDetailSuccess = createAction(
  `${prefix} Get Privilege Detail Success | loadingKey=getPrivilegeDetail`,
  props<{ privilege: PrivilegeDetail }>()
);

export const getPrivilegeDetailFailure = createAction(
  `${prefix} Get Privilege Detail Failure | loadingKey=getPrivilegeDetail`,
  props<{ error: CommonError }>()
);

export const updatePrivilege = createAction(
  `${prefix} Update Privilege | loadingKey=createEditPrivilege`,
  props<{
    data: Partial<CreateEditPrivilegesQueryParams>;
    thumbnailFile: File;
    detailFile: File;
  }>()
);

export const updatePrivilegeSuccess = createAction(
  `${prefix} Update Privilege Success | loadingKey=createEditPrivilege`,
  props<{ isPublished: boolean }>()
);

export const updatePrivilegeFailure = createAction(
  `${prefix} Update Privilege Failure | loadingKey=createEditPrivilege`,
  props<{ messageData: ToastMessageData }>()
);

export const getTierGroups = createAction(
  `${prefix} Get Tier Groups | loadingKey=getTierGroups`,
  props<{ page: number; size: number }>()
);

export const getTierGroupsSuccess = createAction(
  `${prefix} Get Tier Groups Success | loadingKey=getTierGroups`,
  props<{ data: PagedData<TierGroup> }>()
);

export const getTierGroupsFailure = createAction(
  `${prefix} Get Tier Groups Failure | loadingKey=getTierGroups`,
  props<{ error: CommonError }>()
);

export const getSegmentGroups = createAction(
  `${prefix} Get Segment Groups | loadingKey=getSegmentGroups`,
  props<{ page: number; size: number }>()
);

export const getSegmentGroupsSuccess = createAction(
  `${prefix} Get Segment Groups Success | loadingKey=getSegmentGroups`,
  props<{ data: PagedData<SegmentGroup> }>()
);

export const getSegmentGroupsFailure = createAction(
  `${prefix} Get Segment Groups Failure | loadingKey=getSegmentGroups`,
  props<{ error: CommonError }>()
);

export const setIncludeExcludeSegmentTier = createAction(
  `${prefix} set Include Exclude Segment Tier`,
  props<{ items: TierSegmentIncludeExclude[] }>()
);

export const updatePublishedPrivilege = createAction(
  `${prefix} Update Published Privilege | loadingKey=updatePublishedPrivilege`,
  props<{
    privilege_id: number;
    is_published: boolean;
  }>()
);

export const updatePublishedPrivilegeSuccess = createAction(
  `${prefix} Update Published Privilege Success | loadingKey=updatePublishedPrivilege`
);

export const updatePublishedPrivilegeFailure = createAction(
  `${prefix} Update Published Privilege Failure | loadingKey=updatePublishedPrivilege`,
  props<{ messageData: ToastMessageData }>()
);

export const reset = createAction(`${prefix} Reset Create Edit Privilege`);
