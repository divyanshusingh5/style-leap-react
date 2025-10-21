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
            adjuster: String(row.adjuster || '')
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
