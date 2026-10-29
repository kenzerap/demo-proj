import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const customerSegmentationListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'Priority',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Segmentation ID',
    code: 'id',
    type: ColumnType.String,
  },
  {
    value: 'Segment Name',
    code: 'segment_name',
    type: ColumnType.String,
  },
  {
    value: 'Volume',
    code: 'volume',
    type: ColumnType.Number,
  },
  {
    value: 'Active Status',
    code: 'status',
    type: ColumnType.Custom,
  },
  {
    value: 'Created Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
