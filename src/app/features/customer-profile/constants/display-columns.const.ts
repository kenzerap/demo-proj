import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const customerProfilesColumns: TableColumn[] = [
  { value: 'Party ID', code: 'party_id', type: ColumnType.String },
  { value: 'First Name', code: 'first_name', type: ColumnType.String, width: '10rem' },
  { value: 'Last Name', code: 'last_name', type: ColumnType.String, width: '10rem' },
  {
    value: 'National ID / Passport ID',
    code: 'security_no',
    type: ColumnType.SecurityNo,
  },
  { value: 'Email', code: 'email', type: ColumnType.String },
  {
    value: 'Phone',
    code: 'mobile_no',
    type: ColumnType.Phone,
  },
  { value: 'User Type', code: 'userType', type: ColumnType.String },
  { value: 'User Status', code: 'customerStatus', type: ColumnType.String },
  {
    value: 'Created Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
];
