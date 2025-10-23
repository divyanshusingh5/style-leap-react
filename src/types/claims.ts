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
  // Causation factors
  causation_probability: number;
  causation_tx_delay: number;
  causation_tx_gaps: number;
  causation_compliance: number;
  // Severity factors
  severity_allowed_tx_period: number;
  severity_initial_tx: number;
  severity_injections: number;
  severity_objective_findings: number;
  severity_pain_mgmt: number;
  severity_type_tx: number;
  severity_injury_site: number;
  severity_code: number;
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
