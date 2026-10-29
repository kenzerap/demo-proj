import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const ExcludePointByPolicyNoListColumns: TableColumn[] = [
  {
    value: 'Policy No.',
    code: 'policy_no',
    type: ColumnType.String,
  },
  {
    value: 'Party ID',
    code: 'party_ids',
    type: ColumnType.Custom,
  },
  {
    value: 'Product Name',
    code: 'product_name',
    type: ColumnType.String,
  },
  {
    value: 'Create Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Action',
    code: 'actions',
    type: ColumnType.Custom,
    width: '4rem',
  },
];
