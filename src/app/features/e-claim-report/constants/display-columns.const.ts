import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const EclaimReportListColumns: TableColumn[] = [
  {
    value: 'Creation Date',
    code: 'creation_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'System ID',
    code: 'system_id',
    type: ColumnType.String,
  },
  {
    value: 'E-Claim ID',
    code: 'eclaim_id',
    type: ColumnType.String,
  },
  {
    value: 'Patient type',
    code: 'patient_type',
    type: ColumnType.String,
  },
  {
    value: 'Party ID',
    code: 'party_id',
    type: ColumnType.Custom,
  },
  {
    value: 'Policy ID',
    code: 'policy_id',
    type: ColumnType.String,
  },
  {
    value: 'Policy No.',
    code: 'policy_no',
    type: ColumnType.String,
  },
  {
    value: 'Client No.',
    code: 'client_no',
    type: ColumnType.String,
  },
  {
    value: 'First Name',
    code: 'first_name',
    type: ColumnType.String,
  },
  {
    value: 'Last Name',
    code: 'last_name',
    type: ColumnType.String,
  },
  {
    value: 'Email',
    code: 'email',
    type: ColumnType.String,
  },
  {
    value: 'Mobile No.',
    code: 'mobile_no',
    type: ColumnType.Phone,
  },
];
