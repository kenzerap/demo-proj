import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const BrandListColumns: TableColumn[] = [
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Brand Name',
    code: 'brandNameWithImage',
    type: ColumnType.Custom,
  },
  {
    value: 'Brand category',
    code: 'brand_category_name_thai',
    type: ColumnType.String,
  },
  {
    value: 'Active status',
    code: 'status',
    type: ColumnType.Custom,
  },
  {
    value: 'Created date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
