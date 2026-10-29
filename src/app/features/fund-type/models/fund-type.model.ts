import {
  FundTypeChannel,
  FundTypeNationality,
} from './create-edit-fund-type-query-params.model';

export interface FundType {
  fund_id: number;
  amcs: string;
  fund_th: string;
  fund_en: string;
  fund_code_amcs: string;
  fund_code_as400: string;
  fund_type: string;
  risk_level: number;
  remark: string;
  fund_class: string;
  fx_rate_flag: string;
  fx_hedging_prive: string;
  fx_hedging_cep: string;
  is_active: boolean;
  fund_type_th: string;
  fund_type_mkt: string;
  created_date: string;
  created_by: string;
  updated_date: string;
  updated_by: string;
  product_codes: number[];
  channels: FundTypeChannel[];
  nationalities: FundTypeNationality[];
}
