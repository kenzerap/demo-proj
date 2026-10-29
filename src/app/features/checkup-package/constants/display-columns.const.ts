import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const CheckupPackageListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Name (EN)',
    code: 'package_name_en',
    type: ColumnType.String,
  },
  {
    value: 'Name (TH)',
    code: 'package_name_th',
    type: ColumnType.String,
  },
  {
    value: 'Published Status',
    code: 'is_published',
    type: ColumnType.Custom,
  },
  {
    value: 'Update Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
