import { ValueCode } from '@app/shared/models/value-code.model';

export enum InventoryTabCode {
  CodeUploaded = 'codeUploaded',
  GenericCode = 'genericCode',
  PrefixCode = 'prefixCode',
  Product = 'product',
}

export const addInventoryTabs: ValueCode<InventoryTabCode>[] = [
  { value: 'Code Uploaded', code: InventoryTabCode.CodeUploaded },
  // { value: 'Generic Code', code: InventoryTabCode.GenericCode },
  // { value: 'Prefix Code', code: InventoryTabCode.PrefixCode },
  { value: 'Product', code: InventoryTabCode.Product },
];
