import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const claimHistoryColumns: TableColumn[] = [
  { value: 'Claim ID', code: 'claim_id', type: ColumnType.String },
  { value: 'System ID', code: 'system_id', type: ColumnType.String },
  { value: 'Claim No', code: 'claim_no', type: ColumnType.String },
  { value: 'Claim status', code: 'claim_status_code', type: ColumnType.String },
  { value: 'DEMOPROJ365 Status claim', code: 'demoproj365_claim_status', type: ColumnType.String },
  { value: 'Report Date', code: 'report_date', type: ColumnType.Date },
  { value: 'Hospital Name', code: 'hospital_name', type: ColumnType.String },
  { value: 'Incurred Amount', code: 'incurred_amount', type: ColumnType.Number },
  { value: 'Paid Amount', code: 'paid_amount', type: ColumnType.Number },
  { value: 'Benefit of Day', code: 'benefit_no_of_day', type: ColumnType.Number },
  { value: 'Policy No.', code: 'policy_no', type: ColumnType.String },
  { value: 'Renewal Year', code: 'renew_no', type: ColumnType.Number },
  { value: 'Client No.', code: 'client_no', type: ColumnType.String },
  { value: 'Certificated No.', code: 'client_cert_no', type: ColumnType.String },
  { value: 'Received Date', code: 'received_date', type: ColumnType.Date },
  { value: 'Occurred Date', code: 'occurred_date', type: ColumnType.Date },
  { value: 'Payee Name', code: 'payee_name', type: ColumnType.String },
  { value: 'Claim type code', code: 'claim_type_code', type: ColumnType.String },
  { value: 'Approve Paid date', code: 'approve_paid_date', type: ColumnType.Date },
];
