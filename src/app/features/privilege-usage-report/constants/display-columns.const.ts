import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const PrivilegeUsageReportListColumns: TableColumn[] = [
  {
    value: 'Privilege Name',
    code: 'privilege_name',
    type: ColumnType.String,
  },
  {
    value: 'Privilege Type',
    code: 'privilege_type',
    type: ColumnType.String,
  },
  {
    value: 'Brand',
    code: 'brand',
    type: ColumnType.String,
  },
  {
    value: 'Status',
    code: 'formatted_status',
    type: ColumnType.String,
  },
  {
    value: 'Start Date',
    code: 'start_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'End Date',
    code: 'end_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Target Group',
    code: 'target_group_names',
    type: ColumnType.String,
  },
  {
    value: 'Used by Points',
    code: 'used_by_points',
    type: ColumnType.Number,
  },
  {
    value: 'Used by Promo Code',
    code: 'used_by_promo_code',
    type: ColumnType.Number,
  },
  {
    value: 'Used by Unicode',
    code: 'used_by_unicode',
    type: ColumnType.Number,
  },
  {
    value: 'Quota',
    code: 'quota',
    type: ColumnType.Number,
  },
  {
    value: 'Engagement (%)',
    code: 'engagement_percentage',
    type: ColumnType.Number,
  },
];
