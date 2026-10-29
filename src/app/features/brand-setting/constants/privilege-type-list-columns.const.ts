import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const privilegeTypeListColumns: TableColumn[] = [
  {
    value: 'Privilege Type (TH)',
    code: 'brand_category_name_thai',
    type: ColumnType.Custom,
  },
  {
    value: 'Privilege Type (EN)',
    code: 'brand_category_name_english',
    type: ColumnType.Custom,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.Custom,
  },
  {
    value: '',
    code: 'actions',
    type: ColumnType.Custom,
    width: '7rem',
  },
];
