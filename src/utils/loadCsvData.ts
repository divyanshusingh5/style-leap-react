import Papa from 'papaparse';
import { ClaimData } from '@/types/claims';

export async function loadCsvData(): Promise<ClaimData[]> {
  try {
    const response = await fetch('/dat.csv');
    if (!response.ok) {
      throw new Error('Failed to load CSV file');
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => ({
            claim_id: String(row.claim_id || ''),
            VERSIONID: Number(row.VERSIONID || 0),
            claim_date: String(row.claim_date || ''),
            DURATIONTOREPORT: Number(row.DURATIONTOREPORT || 0),
            DOLLARAMOUNTHIGH: Number(row.DOLLARAMOUNTHIGH || 0),
            ALL_BODYPARTS: String(row.ALL_BODYPARTS || ''),
            ALL_INJURIES: String(row.ALL_INJURIES || ''),
            ALL_INJURYGROUP_CODES: String(row.ALL_INJURYGROUP_CODES || ''),
            ALL_INJURYGROUP_TEXTS: String(row.ALL_INJURYGROUP_TEXTS || ''),
            PRIMARY_INJURY: String(row.PRIMARY_INJURY || ''),
            PRIMARY_BODYPART: String(row.PRIMARY_BODYPART || ''),
            PRIMARY_INJURYGROUP_CODE: String(row.PRIMARY_INJURYGROUP_CODE || ''),
            INJURY_COUNT: Number(row.INJURY_COUNT || 0),
            BODYPART_COUNT: Number(row.BODYPART_COUNT || 0),
            INJURYGROUP_COUNT: Number(row.INJURYGROUP_COUNT || 0),
            SETTLEMENT_DAYS: Number(row.SETTLEMENT_DAYS || 0),
            SETTLEMENT_MONTHS: Number(row.SETTLEMENT_MONTHS || 0),
            SETTLEMENT_YEARS: Number(row.SETTLEMENT_YEARS || 0),
            IMPACT: Number(row.IMPACT || 0),
            COUNTYNAME: String(row.COUNTYNAME || ''),
            VENUESTATE: String(row.VENUESTATE || ''),
            VENUE_RATING: String(row.VENUE_RATING || ''),
            RATINGWEIGHT: Number(row.RATINGWEIGHT || 0),
            INJURY_GROUP_CODE: String(row.INJURY_GROUP_CODE || ''),
            CAUSATION__HIGH_RECOMMENDATION: Number(row.CAUSATION__HIGH_RECOMMENDATION || 0),
            SEVERITY_SCORE: Number(row.SEVERITY_SCORE || 0),
            CAUTION_LEVEL: String(row.CAUTION_LEVEL || ''),
            adjuster: String(row.adjuster || ''),
            predicted_pain_suffering: Number(row.predicted_pain_suffering || 0),
            variance_pct: Number(row.variance_pct || 0),
            // Causation factors
            causation_probability: Number(row.causation_probability || 0),
            causation_tx_delay: Number(row.causation_tx_delay || 0),
            causation_tx_gaps: Number(row.causation_tx_gaps || 0),
            causation_compliance: Number(row.causation_compliance || 0),
            // Severity factors
            severity_allowed_tx_period: Number(row.severity_allowed_tx_period || 0),
            severity_initial_tx: Number(row.severity_initial_tx || 0),
            severity_injections: Number(row.severity_injections || 0),
            severity_objective_findings: Number(row.severity_objective_findings || 0),
            severity_pain_mgmt: Number(row.severity_pain_mgmt || 0),
            severity_type_tx: Number(row.severity_type_tx || 0),
            severity_injury_site: Number(row.severity_injury_site || 0),
            severity_code: Number(row.severity_code || 0)
          })) as ClaimData[];
          
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}
