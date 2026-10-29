import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const UserAccountReportListColumns: TableColumn[] = [
  {
    value: 'Party ID',
    code: 'party_id',
    type: ColumnType.Custom,
  },
  {
    value: 'Registration Date',
    code: 'registration_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'First Name',
    code: 'first_name',
    type: ColumnType.String,
  },
  {
    value: 'Last Name',
    code: 'last_name',
    type: ColumnType.String,
  },
  {
    value: 'User Type',
    code: 'user_type',
    type: ColumnType.Custom,
  },
  {
    value: 'Tier',
    code: 'tier',
    type: ColumnType.Custom,
  },
  {
    value: 'Point Remaining',
    code: 'point_remaining',
    type: ColumnType.Number,
  },
  {
    value: 'Point Spending',
    code: 'point_spending',
    type: ColumnType.Number,
  },
  {
    value: 'Individual',
    code: 'individual_policy',
    type: ColumnType.Custom,
  },
  {
    value: 'Group',
    code: 'group_policy',
    type: ColumnType.Custom,
  }
];
