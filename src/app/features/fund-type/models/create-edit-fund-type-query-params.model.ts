export interface CreateEditFundTypeQueryParams {
  fund_id?: number;
  amcs: string;
  fund_th: string;
  fund_en: string;
  fund_code_amcs: string;
  fund_code_as400: string;
  fund_type: string;
  risk_level: number;
  fund_class: string;
  fx_rate_flag: string;
  fx_hedging_prive: string;
  fx_hedging_cep: string;
  remark: string;
  is_active: boolean;
  fund_type_th: string;
  fund_type_mkt: string;
  channels: FundTypeChannel[];
  product_codes: number[];
  nationalities: FundTypeNationality[];
  action_by?: string;
}

export interface FundTypeChannel {
  channel_id: number;
  visible: boolean;
}

export interface FundTypeNationality {
  nationality_id: number;
  allowed: boolean;
}
