import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const segmentationListColumns: TableColumn[] = [
  {
    value: 'Segmentation name',
    code: 'segment_name',
    type: ColumnType.String,
  },
  {
    value: 'Type',
    code: 'type',
    type: ColumnType.String,
  },
  {
    value: 'Volume',
    code: 'segment_users_volume',
    type: ColumnType.Number,
  },
  {
    value: 'Option',
    code: 'option',
    type: ColumnType.Custom,
    width: '10rem',
  },
];
