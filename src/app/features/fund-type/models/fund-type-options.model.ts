export interface FundTypeChannelOption {
  channel_id: number;
  channel_code: string;
  name_th: string;
  name_en: string;
}

export interface FundTypeProductCodeOption {
  product_code_id: number;
  product_code: string;
}

export interface FundTypeNationalityOption {
  nationality_id: number;
  nationality_code: string;
  name_th: string;
  name_en: string;
}

export interface FundTypeOptions {
  channels: FundTypeChannelOption[];
  product_codes: FundTypeProductCodeOption[];
  nationalities: FundTypeNationalityOption[];
}
