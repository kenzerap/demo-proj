import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const HospitalListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Name (TH)',
    code: 'name_th',
    type: ColumnType.String,
    width: '13rem',
    isSortable: true,
  },
  {
    value: 'Name (EN)',
    code: 'name_en',
    type: ColumnType.String,
    width: '13rem',
    isSortable: true,
  },
  {
    value: 'Province',
    code: 'province_name_th',
    type: ColumnType.String,
  },
  {
    value: 'District',
    code: 'amphur_name_th',
    type: ColumnType.String,
  },
  {
    value: 'Published Status',
    code: 'is_published',
    type: ColumnType.Custom,
    isSortable: true,
  },
  {
    value: 'Update Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
    isSortable: true,
  },
];
