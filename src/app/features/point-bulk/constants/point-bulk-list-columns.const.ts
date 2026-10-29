import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const PointBulkListColumns: TableColumn[] = [
  {
    value: 'Subject',
    code: 'subject',
    type: ColumnType.String,
  },
  {
    value: 'Note',
    code: 'note',
    type: ColumnType.String,
  },
  {
    value: 'Point expiry date',
    code: 'point_expiry_date',
    type: ColumnType.Date,
  },
  {
    value: 'Uploaded date',
    code: 'upload_date',
    type: ColumnType.DateTime,
  },
];
