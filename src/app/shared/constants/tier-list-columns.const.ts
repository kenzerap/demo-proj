import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const tierListColumns: TableColumn[] = [
  {
    value: 'Tier',
    code: 'tier_name_thai',
    type: ColumnType.String,
  },
  {
    value: 'Color Tier',
    code: 'color',
    type: ColumnType.Custom,
  },
  {
    value: 'Detail',
    code: 'detail',
    type: ColumnType.String,
  },
  {
    value: 'Created Date',
    code: 'created_date',
    type: ColumnType.DateTime,
    width: '10rem',
  },
  {
    value: 'Option',
    code: 'option',
    type: ColumnType.Custom,
    width: '10rem',
  },
];
