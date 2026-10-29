import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const privilegeColumns: TableColumn[] = [
  {
    value: 'Privilege Name',
    code: 'privilegeName',
    type: ColumnType.Custom,
    isSortable: true,
  },
  {
    value: 'Segmentation',
    code: 'segmentName',
    type: ColumnType.String,
    isSortable: true,
  },
  {
    value: 'Total Quota',
    code: 'quota',
    type: ColumnType.Number,
    isSortable: true,
  },
  {
    value: 'End Date',
    code: 'endDateTime',
    type: ColumnType.DateTime,
    isSortable: true,
  },
];
