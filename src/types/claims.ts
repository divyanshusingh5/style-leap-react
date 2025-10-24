export interface ClaimData {
  claim_id: string;
  VERSIONID: number;
  claim_date: string;
  DURATIONTOREPORT: number;
  DOLLARAMOUNTHIGH: number;
  ALL_BODYPARTS: string;
  ALL_INJURIES: string;
  ALL_INJURYGROUP_CODES: string;
  ALL_INJURYGROUP_TEXTS: string;
  PRIMARY_INJURY: string;
  PRIMARY_BODYPART: string;
  PRIMARY_INJURYGROUP_CODE: string;
  INJURY_COUNT: number;
  BODYPART_COUNT: number;
  INJURYGROUP_COUNT: number;
  SETTLEMENT_DAYS: number;
  SETTLEMENT_MONTHS: number;
  SETTLEMENT_YEARS: number;
  IMPACT: number;
  COUNTYNAME: string;
  VENUESTATE: string;
  VENUE_RATING: string;
  RATINGWEIGHT: number;
  INJURY_GROUP_CODE: string;
  CAUSATION__HIGH_RECOMMENDATION: number;
  SEVERITY_SCORE: number;
  CAUTION_LEVEL: string;
  adjuster: string;
  predicted_pain_suffering: number;
  variance_pct: number;
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
  injuryGroupCode: string;
  county: string;
  severityScore: string;
  cautionLevel: string;
  venueRating: string;
  impact: string;
  year: string;
}

export type TabType = 'overview' | 'recommendations' | 'alignment' | 'injury' | 'adjuster' | 'venue';
