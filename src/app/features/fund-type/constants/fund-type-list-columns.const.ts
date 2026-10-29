import {
  ColumnType,
  TableColumn,
} from 'src/app/shared/components/demoproj-table/models/table-column.model';

export const FundTypeListColumns: TableColumn[] = [
  {
    value: 'Fund ID',
    code: 'fund_id',
    type: ColumnType.String,
  },
  {
    value: 'AMCS',
    code: 'amcs',
    type: ColumnType.String,
  },
  {
    value: 'Fund Code (AMCS)',
    code: 'fund_code_amcs',
    type: ColumnType.String,
    width: '8rem',
  },
  {
    value: 'Fund Code (AS400)',
    code: 'fund_code_as400',
    type: ColumnType.String,
    width: '8rem',
  },
  {
    value: 'Fund Name TH',
    code: 'fund_th',
    type: ColumnType.String,
    width: '8rem',
  },
  {
    value: 'Fund Name EN',
    code: 'fund_en',
    type: ColumnType.String,
  },
  {
    value: 'Fund Type',
    code: 'fund_type',
    type: ColumnType.String,
  },
  {
    value: 'Fund Type TH',
    code: 'fund_type_th',
    type: ColumnType.String,
  },
  {
    value: 'Fund Type MKT',
    code: 'fund_type_mkt',
    type: ColumnType.String,
  },
  {
    value: 'Fund Class',
    code: 'fund_class',
    type: ColumnType.String,
  },
  {
    value: 'Risk Level',
    code: 'risk_level',
    type: ColumnType.String,
  },
  {
    value: 'FX Rate Flag',
    code: 'fx_rate_flag',
    type: ColumnType.String,
  },
  {
    value: 'FX Hedging (Prive)',
    code: 'fx_hedging_prive',
    type: ColumnType.String,
  },
  {
    value: 'FX Hedging (CEP)',
    code: 'fx_hedging_cep',
    type: ColumnType.String,
  },
  {
    value: 'Remark',
    code: 'remark',
    type: ColumnType.String,
  },
  {
    value: 'Status',
    code: 'is_active',
    type: ColumnType.Custom,
  },
  {
    value: 'Updated Date',
    code: 'updated_date',
    type: ColumnType.DateTime,
  },
  {
    value: 'Updated By',
    code: 'updated_by',
    type: ColumnType.String,
    width: '5rem',
  },
];
