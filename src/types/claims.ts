export interface ClaimData {
  claim_id: string;
  claim_date: string;
  days_to_settlement: number;
  county: string;
  state: string;
  body_part: string;
  primary_injury: string;
  injury_group: string;
  severity: number;
  caution_score: number;
  venue_rating: string;
  impact_life: number;
  final_settlement: number;
  predicted_pain_suffering: number;
  variance_pct: number;
  adjuster: string;
}

export interface FilterState {
  injuryGroup: string;
  county: string;
  severity: string;
  caution: string;
  venueRating: string;
  impactLife: string;
  year: string;
}

export type TabType = 'overview' | 'recommendations' | 'alignment' | 'injury' | 'adjuster' | 'venue';
