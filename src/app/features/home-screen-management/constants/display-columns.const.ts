import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const HomeScreenManagementListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'ID',
    code: 'id',
    type: ColumnType.String,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Section Name',
    code: 'section_name',
    type: ColumnType.String,
  },
  {
    value: 'Published Status',
    code: 'is_published',
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
