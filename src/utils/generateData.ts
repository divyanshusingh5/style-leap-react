import { ClaimData } from "@/types/claims";

export function generateDummyData(): ClaimData[] {
  const counties = ['Cook', 'Mecklenburg', 'Harris', 'Maricopa', 'King', 'Miami-Dade', 'Dallas', 'Orange', 'Broward', 'Riverside', 'San Diego', 'Bexar'];
  const states = ['IL', 'NC', 'TX', 'AZ', 'WA', 'FL', 'TX', 'CA', 'FL', 'CA', 'CA', 'TX'];
  const bodyParts = ['Spine', 'Neck', 'Jaw', 'Joint Left', 'Right', 'Leg', 'Arm', 'Head'];
  const injuries = ['Whiplash', 'Fracture', 'JFLE', 'SSUE', 'Sprain', 'Tear', 'Contusion'];
  const injuryGroups = ['Group_NB', 'Group_JFL', 'Group_SSU', 'Group_LEG', 'Group_HEAD', 'Group_ARM'];
  const adjusters = ['Sarah Williams', 'Mike Johnson', 'Emily Chen', 'David Martinez', 'Lisa Anderson', 'James Wilson'];
  const venueRatings = ['moderate', 'conservative', 'liberal', 'extreme'];
  
  // Causation factor weights
  const causationProbabilityWeights = [0.3257, 0.2212, 0.4478, 0.0000];
  const causationTxDelayWeights = [0.1226, 0.0000];
  const causationTxGapsWeights = [0.1313, 0.0000];
  const causationComplianceWeights = [0.1474, 0.0864];
  
  // Severity factor weights
  const severityAllowedTxPeriodWeights = [1.4488, 0.0000, 2.3490, 3.1606, 3.8533, 4.3507];
  const severityInitialTxWeights = [1.5445, 1.2406, 0.6738, 0.0000];
  const severityInjectionsWeights = [0.0000, 1.9855, 3.0855, 3.4370, 5.1228];
  const severityObjectiveFindingsWeights = [2.7611, 0.0000];
  const severityPainMgmtWeights = [0.0000, 0.6396, 1.1258];
  const severityTypeTxWeights = [2.0592, 3.2501];
  const severityInjurySiteWeights = [1.8450, 1.1767, 0.9862, 0.4866, 0.0000];
  const severityCodeWeights = [0.4864, 0.3803, 0.8746, 0.0000];
  
  const data: ClaimData[] = [];
  
  for (let i = 0; i < 500; i++) {
    let year;
    const r = Math.random();
    if (r < 0.3) year = 2023;
    else if (r < 0.7) year = 2024;
    else year = 2025;
    
    let month = Math.floor(Math.random() * 12) + 1;
    if (year === 2025) month = Math.floor(Math.random() * 9) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const claimDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const daysToSettle = Math.floor(Math.random() * 120) + 30;
    const severity = Math.floor(Math.random() * 15) + 1;
    const cautionScore = Math.floor(Math.random() * 11);
    const venueRating = venueRatings[Math.floor(Math.random() * 4)];
    const impactLife = Math.floor(Math.random() * 5);
    const finalSettlement = Math.floor(Math.random() * 150000) + 2000;
    const predicted = finalSettlement * (0.7 + Math.random() * 0.6);
    const variancePct = ((finalSettlement - predicted) / predicted) * 100;
    const countyIdx = Math.floor(Math.random() * counties.length);
    
    data.push({
      claim_id: `CLM-${1000 + i}`,
      claim_date: claimDate,
      days_to_settlement: daysToSettle,
      county: counties[countyIdx],
      state: states[countyIdx],
      body_part: bodyParts[Math.floor(Math.random() * bodyParts.length)],
      primary_injury: injuries[Math.floor(Math.random() * injuries.length)],
      injury_group: injuryGroups[Math.floor(Math.random() * injuryGroups.length)],
      severity,
      caution_score: cautionScore,
      venue_rating: venueRating,
      impact_life: impactLife,
      final_settlement: finalSettlement,
      predicted_pain_suffering: predicted,
      variance_pct: variancePct,
      adjuster: adjusters[Math.floor(Math.random() * adjusters.length)],
      // Causation factors - randomly select from available weights
      causation_probability: causationProbabilityWeights[Math.floor(Math.random() * causationProbabilityWeights.length)],
      causation_tx_delay: causationTxDelayWeights[Math.floor(Math.random() * causationTxDelayWeights.length)],
      causation_tx_gaps: causationTxGapsWeights[Math.floor(Math.random() * causationTxGapsWeights.length)],
      causation_compliance: causationComplianceWeights[Math.floor(Math.random() * causationComplianceWeights.length)],
      // Severity factors - randomly select from available weights
      severity_allowed_tx_period: severityAllowedTxPeriodWeights[Math.floor(Math.random() * severityAllowedTxPeriodWeights.length)],
      severity_initial_tx: severityInitialTxWeights[Math.floor(Math.random() * severityInitialTxWeights.length)],
      severity_injections: severityInjectionsWeights[Math.floor(Math.random() * severityInjectionsWeights.length)],
      severity_objective_findings: severityObjectiveFindingsWeights[Math.floor(Math.random() * severityObjectiveFindingsWeights.length)],
      severity_pain_mgmt: severityPainMgmtWeights[Math.floor(Math.random() * severityPainMgmtWeights.length)],
      severity_type_tx: severityTypeTxWeights[Math.floor(Math.random() * severityTypeTxWeights.length)],
      severity_injury_site: severityInjurySiteWeights[Math.floor(Math.random() * severityInjurySiteWeights.length)],
      severity_code: severityCodeWeights[Math.floor(Math.random() * severityCodeWeights.length)]
    });
  }
  
  return data;
}
