import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const segmentPartyIdFileListColumns: TableColumn[] = [
  {
    value: 'File name',
    code: 'file_name',
    type: ColumnType.String,
  },
  {
    value: 'Volume',
    code: 'volume',
    type: ColumnType.String,
  },
  {
    value: 'Status',
    code: 'status',
    type: ColumnType.String,
  },
  {
    value: 'Imported date',
    code: 'imported_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Imported by',
    code: 'imported_by',
    type: ColumnType.String,
  },
  {
    value: 'Actions',
    code: 'actions',
    type: ColumnType.Custom,
  },
];
