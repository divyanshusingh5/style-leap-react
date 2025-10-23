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
            claim_date: String(row.claim_date || ''),
            days_to_settlement: Number(row.days_to_settlement || 0),
            county: String(row.county || ''),
            state: String(row.state || ''),
            body_part: String(row.body_part || ''),
            primary_injury: String(row.primary_injury || ''),
            injury_group: String(row.injury_group || ''),
            severity: Number(row.severity || 0),
            caution_score: Number(row.caution_score || 0),
            venue_rating: String(row.venue_rating || ''),
            impact_life: Number(row.impact_life || 0),
            final_settlement: Number(row.final_settlement || 0),
            predicted_pain_suffering: Number(row.predicted_pain_suffering || 0),
            variance_pct: Number(row.variance_pct || 0),
            adjuster: String(row.adjuster || ''),
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
