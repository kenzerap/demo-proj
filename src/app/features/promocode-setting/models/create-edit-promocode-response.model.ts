export interface CreateEditPromocodesResponse {
  saved: boolean;
  duplicated: boolean;
  promocode: {
    promocode_id: number;
    name: string;
  }[];
}
