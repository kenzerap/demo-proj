import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const evoucherListColumns: TableColumn[] = [
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.Number,
    isSortable: true,
  },
  {
    value: 'Privilege ID',
    code: 'privilege_id',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Segment',
    code: 'segment_name',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Name',
    code: 'privilege_name_th',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Brand',
    code: 'brand_name_th',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Quantity',
    code: 'redeemed_per_total',
    type: ColumnType.Custom,
    isSortable: true,
  },
  {
    value: 'Published status',
    code: 'is_published',
    type: ColumnType.Custom,
    isSortable: true,
  },
];
