import { ValueCode } from '@app/shared/models/value-code.model';

export const healthcareFormVariables: ValueCode[] = [
  { value: 'Full Name', code: `{{fullName}}` },
  { value: 'Email', code: `{{email}}` },
  { value: 'Package', code: `{{package}}` },
  { value: 'Province', code: `{{province}}` },
  { value: 'Hospital', code: `{{hospital}}` },
  { value: 'Month', code: `{{month}}` },
  { value: 'Year', code: `{{year}}` },
];

export const voucherFormVariables: ValueCode[] = [
  { value: 'Full Name', code: `{{fullName}}` },
  { value: 'Email', code: `{{email}}` },
  { value: 'Address', code: `{{address}}` },
  { value: 'Postcode', code: `{{postcode}}` },
  { value: 'Province', code: `{{province}}` },
  { value: 'District', code: `{{district}}` },
  { value: 'Sub District', code: `{{subDistrict}}` },
];
