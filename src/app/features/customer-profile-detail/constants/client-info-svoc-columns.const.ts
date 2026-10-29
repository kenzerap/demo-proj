import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const clientInfoSvocColumns: TableColumn[] = [
  { value: 'Party ID', code: 'party_id', type: ColumnType.Custom },
  { value: 'System', code: 'system', type: ColumnType.String },
  { value: 'Client ID', code: 'client_id', type: ColumnType.String },
  { value: 'Client No.', code: 'client_no', type: ColumnType.String },
  { value: 'Cert No.', code: 'client_cert_no', type: ColumnType.String },
  {
    value: 'Security No.',
    code: 'security_no_nhash',
    type: ColumnType.String,
    width: '5rem',
  },
  { value: 'First Name', code: 'client_first_name', type: ColumnType.String },
  { value: 'Last Name', code: 'client_last_name', type: ColumnType.String },
  {
    value: 'Mobile Phone',
    code: 'client_mobile1',
    type: ColumnType.String,
    width: '5rem',
  },
  { value: 'Email', code: 'client_email', type: ColumnType.String },
  { value: 'Birthdate', code: 'client_birth_date', type: ColumnType.Date },
  { value: 'Gender', code: 'client_gender', type: ColumnType.String },
  {
    value: 'Married Status',
    code: 'client_marr_status',
    type: ColumnType.String,
  },
  { value: 'Address', code: 'client_addr', type: ColumnType.String },
  { value: 'Tier', code: 'customer_tier', type: ColumnType.String },
  {
    value: 'Created Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
