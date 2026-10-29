import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const AccountSettingListColumns: TableColumn[] = [
  {
    value: 'Username',
    code: 'username',
    type: ColumnType.String,
  },
  {
    value: 'Name',
    code: 'name',
    type: ColumnType.Custom,
  },
  {
    value: 'Group',
    code: 'group_name',
    type: ColumnType.String,
  },
  {
    value: 'Status',
    code: 'status',
    type: ColumnType.String,
  },
  {
    value: 'Create Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Status Changed Update',
    code: 'updated_status_date',
    type: ColumnType.DateTime,
  },
];
