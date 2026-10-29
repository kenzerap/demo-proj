import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const policyDetailDefaultColumns: TableColumn[] = [
  { value: 'Policy Number', code: 'policy_no', type: ColumnType.String },
  { value: 'Policy ID', code: 'policy_id', type: ColumnType.String },
  { value: 'Client No', code: 'client_no', type: ColumnType.String },
  { value: 'Policy Name', code: 'product_name', type: ColumnType.String },
  {
    value: 'Policy Status',
    code: 'policy_status',
    type: ColumnType.String,
  },
  {
    value: 'Policy Type',
    code: 'product_type',
    type: ColumnType.String,
  },
  {
    value: 'Sum Insured (Baht)',
    code: 'policy_sum_insured_amount',
    type: ColumnType.Number,
  },
  {
    value: 'Insured Name',
    code: 'insured_name',
    type: ColumnType.String,
  },
  {
    value: 'Premium Payer',
    code: 'policy_payer_name',
    type: ColumnType.String,
  },
  {
    value: 'Protection Period',
    code: 'coverage_term',
    type: ColumnType.String,
  },
  {
    value: 'Effective Date',
    code: 'policy_effect_date',
    type: ColumnType.Date,
  },
  {
    value: 'Expiry Date',
    code: 'policy_expired_date',
    type: ColumnType.Date,
  },
  {
    value: 'Premium Payment Duration (Years)',
    code: 'premium_term',
    type: ColumnType.String,
  },
  {
    value: 'Premium Payment Period',
    code: 'premium_payment_period',
    type: ColumnType.String,
  },
  {
    value: 'Address',
    code: 'address',
    type: ColumnType.String,
  },
];

export const policyDetailGroupColumns: TableColumn[] = [
  { value: 'Policy Number', code: 'policy_no', type: ColumnType.String },
  { value: 'Policy ID', code: 'policy_id', type: ColumnType.String },
  { value: 'Policy Name', code: 'product_name', type: ColumnType.String },
  {
    value: 'Policy Status',
    code: 'last_policy_status',
    type: ColumnType.String,
  },
  {
    value: 'Certificated Number',
    code: 'client_cert_no',
    type: ColumnType.String,
  },
  {
    value: 'Company',
    code: 'policy_holder',
    type: ColumnType.String,
  },
  { value: 'Insured Name', code: 'insured_name', type: ColumnType.String },
  {
    value: 'Effective Date',
    code: 'policy_effect_date',
    type: ColumnType.Date,
  },
  {
    value: 'Expiry Date',
    code: 'policy_expired_date',
    type: ColumnType.Date,
  },
];
