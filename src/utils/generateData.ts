import { ClaimData } from "@/types/claims";

export function generateDummyData(): ClaimData[] {
  const counties = ['Cook', 'Mecklenburg', 'Harris', 'Maricopa', 'King', 'Miami-Dade', 'Dallas', 'Orange', 'Broward', 'Riverside', 'San Diego', 'Bexar'];
  const states = ['IL', 'NC', 'TX', 'AZ', 'WA', 'FL', 'TX', 'CA', 'FL', 'CA', 'CA', 'TX'];
  const bodyParts = ['Spine', 'Neck', 'Jaw', 'Joint Left', 'Right', 'Leg', 'Arm', 'Head'];
  const injuries = ['Whiplash', 'Fracture', 'JFLE', 'SSUE', 'Sprain', 'Tear', 'Contusion'];
  const injuryGroups = ['Group_NB', 'Group_JFL', 'Group_SSU', 'Group_LEG', 'Group_HEAD', 'Group_ARM'];
  const adjusters = ['Sarah Williams', 'Mike Johnson', 'Emily Chen', 'David Martinez', 'Lisa Anderson', 'James Wilson'];
  const venueRatings = ['moderate', 'conservative', 'liberal', 'extreme'];
  
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
      adjuster: adjusters[Math.floor(Math.random() * adjusters.length)]
    });
  }
  
  return data;
}
