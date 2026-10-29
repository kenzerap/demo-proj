import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const otpHistoryColumns: TableColumn[] = [
  {
    value: 'OTP id.',
    code: 'otp_id',
    type: ColumnType.String,
  },
  {
    value: 'Created Date',
    code: 'created_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'OTP',
    code: 'otp_code',
    type: ColumnType.String,
  },
  {
    value: 'Message',
    code: 'message',
    type: ColumnType.String,
  },
  {
    value: 'Mobile No',
    code: 'mobile_no',
    type: ColumnType.String,
  },
  {
    value: 'Sender',
    code: 'sender',
    type: ColumnType.String,
  },
  {
    value: 'Channel',
    code: 'channel',
    type: ColumnType.String,
  },
  {
    value: 'Error Code',
    code: 'error_code',
    type: ColumnType.String,
  },
  {
    value: 'Error Message',
    code: 'error_message',
    type: ColumnType.String,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
];
