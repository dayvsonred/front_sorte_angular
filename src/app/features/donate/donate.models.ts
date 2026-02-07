export type DonationFrequency = 'once' | 'monthly';
export type PaymentMethod = 'google_pay' | 'card';

export interface DonationSummary {
  donation: number;
  tip: number;
  total: number;
}

export interface SuggestedAmount {
  value: number;
  label?: string;
}
