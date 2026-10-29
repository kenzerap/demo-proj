import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const bannerSettingListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'ID',
    code: 'banner_id',
    type: ColumnType.String,
  },
  {
    value: 'Display Order',
    code: 'display_order',
    type: ColumnType.String,
  },
  {
    value: 'Segment',
    code: 'targetGroupName',
    type: ColumnType.String,
  },
  {
    value: 'Name',
    code: 'bannerNameWithImage',
    type: ColumnType.Custom,
  },
  {
    value: 'Published status',
    code: 'is_published',
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
