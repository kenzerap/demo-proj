import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const scheduledSentListColumns: TableColumn[] = [
  {
    value: 'ID',
    code: 'id',
    type: ColumnType.String,
  },
  {
    value: 'Segment',
    code: 'segment_name',
    type: ColumnType.String,
  },
  {
    value: 'Title',
    code: 'message_title_thai',
    type: ColumnType.String,
  },
  {
    value: 'Body',
    code: 'message_body_thai',
    type: ColumnType.String,
  },
  {
    value: 'Send time period',
    code: 'send_time_type_display',
    type: ColumnType.String,
  },
  {
    value: 'Send date',
    code: 'start_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'Update Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
