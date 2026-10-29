import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const eClaimSubmitColumns: TableColumn[] = [
  { value: 'Created Date', code: 'createdDate', type: ColumnType.DateTime },
  { value: 'e-Claim ID', code: 'eclaimId', type: ColumnType.String },
  { value: 'Patient Type', code: 'patientType', type: ColumnType.String },
  {
    value: 'Receipt',
    code: 'receiptImages',
    type: ColumnType.Custom,
    width: '5rem',
  },
  {
    value: 'Medical Certificates',
    code: 'medicalCertificates',
    type: ColumnType.Custom,
    width: '10rem',
  },
  {
    value: 'Other Document',
    code: 'otherDocuments',
    type: ColumnType.Custom,
    width: '9rem'
  },
  { value: 'Action', code: 'actions', type: ColumnType.Custom },
];
