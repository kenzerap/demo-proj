import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const UnicodeListColumns: TableColumn[] = [
  {
    value: 'Unicode Name',
    code: 'unicode_name',
    type: ColumnType.String,
  },
  {
    value: 'Description',
    code: 'unicode_description',
    type: ColumnType.String,
  },
  {
    value: 'Prefix Code',
    code: 'codes',
    type: ColumnType.Custom,
  },
  {
    value: 'Rewards',
    code: 'rewards',
    type: ColumnType.Custom,
  },
  {
    value: 'Privilege Linked',
    code: 'privilege_name',
    type: ColumnType.String,
  },
  {
    value: 'Point',
    code: 'earning_point',
    type: ColumnType.Custom,
  },
  {
    value: 'Quota',
    code: 'quota',
    type: ColumnType.Number,
  },
  {
    value: 'Redemption',
    code: 'redemption',
    type: ColumnType.Number,
  },
  {
    value: 'Start Date',
    code: 'start_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'End Date',
    code: 'end_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated By',
    code: 'updated_by',
    type: ColumnType.String,
    width: '5rem',
  },
];
