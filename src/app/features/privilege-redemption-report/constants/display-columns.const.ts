import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const PrivilegeRedemptionReportListColumns: TableColumn[] = [
  {
    value: 'Party ID',
    code: 'party_id',
    type: ColumnType.Custom,
  },
  {
    value: 'Redemption Date',
    code: 'redeemtion_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'National ID',
    code: 'national_id',
    type: ColumnType.SecurityNo,
  },
  {
    value: 'First Name',
    code: 'first_name',
    type: ColumnType.String,
    width: '5rem',
  },
  {
    value: 'Last Name',
    code: 'last_name',
    type: ColumnType.String,
    width: '5rem',
  },
  {
    value: 'Name (AS400)',
    code: 'client_full_name',
    type: ColumnType.String,
    width: '5rem',
  },
  {
    value: 'Mobile No.',
    code: 'mobile_no',
    type: ColumnType.Phone,
    width: '10rem',
  },
  { value: 'Email', code: 'email', type: ColumnType.String, width: '5rem' },
  {
    value: 'Address (Register)',
    code: 'formatted_registration_address',
    type: ColumnType.String,
    width: '6rem',
  },
  {
    value: 'Address (Delivery)',
    code: 'formatted_delivery_address',
    type: ColumnType.String,
    width: '6rem',
  },
  {
    value: 'Policy No.',
    code: 'policy_no_format',
    type: ColumnType.String,
    width: '7rem',
  },
  {
    value: 'Privilege ID',
    code: 'privilege_id',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Name',
    code: 'privilege_name',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Type',
    code: 'privilege_type',
    type: ColumnType.String,
  },
  {
    value: 'Healthcare Package',
    code: 'package_name',
    type: ColumnType.String,
  },
  {
    value: 'Hospital',
    code: 'hospital_name',
    type: ColumnType.String,
  },
  {
    value: 'Name (ผู้ตรวจ)',
    code: 'rh_full_name',
    type: ColumnType.String,
  },
  {
    value: 'Period',
    code: 'rh_month',
    type: ColumnType.Custom,
  },
  {
    value: 'Redeemed By',
    code: 'redeemed_by',
    type: ColumnType.String,
  },
  {
    value: 'Redeem point',
    code: 'redeemed_point',
    type: ColumnType.Number,
  },
  {
    value: 'Promocode',
    code: 'promocode_code',
    type: ColumnType.String,
  },
  {
    value: 'Unicode',
    code: 'unicode_code',
    type: ColumnType.String,
  },
];
