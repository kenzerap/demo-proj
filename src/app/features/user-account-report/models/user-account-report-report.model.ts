export interface UserAccountReportTotals {
  total: number;
  total_insured: number;
  total_prospect: number;
  total_blocked: number;
  total_fraud: number;
  total_individual: number;
  total_group: number;
  total_both: number;
  calculated_at: string;
}

export interface UserAccountReportLists {
  party_id: number;
  registration_date: string;
  first_name: string;
  last_name: string;
  user_type: string;
  tier: string;
  point_remaining: number;
  point_spending: number;
  individual_policy: boolean;
  group_policy: boolean;
}
