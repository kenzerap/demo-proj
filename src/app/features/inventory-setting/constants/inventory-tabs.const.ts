import { ValueCode } from '@app/shared/models/value-code.model';

export enum InventoryTabCode {
  UPLOAD_CODE = 'upload-code',
  GENERIC_CODE = 'generic-code',
  PREFIX_CODE = 'prefix-code',
  PRODUCT = 'product',
}

export const InventoryTabs: ValueCode[] = [
  { value: 'Upload code', code: InventoryTabCode.UPLOAD_CODE },
  // { value: 'Generic Code', code: InventoryTabCode.GENERIC_CODE },
  // { value: 'Prefix Code', code: InventoryTabCode.PREFIX_CODE },
  { value: 'Product', code: InventoryTabCode.PRODUCT },
];
