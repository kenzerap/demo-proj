import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const triggerEventBasedListColumns: TableColumn[] = [
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
    value: 'Trigger event',
    code: 'trigger_event_type_display',
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
    value: 'Published status',
    code: 'published',
    type: ColumnType.Custom,
  },
  {
    value: 'Start Date',
    code: 'start_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'End Date',
    code: 'end_date_time',
    type: ColumnType.DateTime,
  },
  {
    value: 'Update Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
