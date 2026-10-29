import {
  ColumnType,
  TableColumn,
} from '@app/shared/components/demoproj-table/models/table-column.model';

export const SplashScreenManagementListColumns: TableColumn[] = [
  {
    value: 'ID',
    code: 'splash_screen_id',
    type: ColumnType.String,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Name',
    code: 'nameWithImage',
    type: ColumnType.Custom,
  },
  {
    value: 'Description',
    code: 'description_th',
    type: ColumnType.String,
  },
  {
    value: 'Active Status',
    code: 'is_active',
    type: ColumnType.Custom,
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
    value: 'Update Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
