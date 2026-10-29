import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const popupAnnouncementListColumns: TableColumn[] = [
  {
    value: '',
    code: 'dragDrop',
    type: ColumnType.DragDrop,
  },
  {
    value: 'ID',
    code: 'bannerId',
    type: ColumnType.String,
  },
  {
    value: 'Display Order',
    code: 'displayOrder',
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
    code: 'isPublished',
    type: ColumnType.Custom,
  },
  {
    value: 'Start Date',
    code: 'startDateTime',
    type: ColumnType.DateTime,
  },
  {
    value: 'End Date',
    code: 'endDateTime',
    type: ColumnType.DateTime,
  },
  {
    value: 'Update Date',
    code: 'updatedDate',
    type: ColumnType.DateTime,
  },
];
