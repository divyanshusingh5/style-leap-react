import { useState, useMemo, useEffect } from 'react';
import { ClaimData, FilterState } from '@/types/claims';
import { loadCsvData } from '@/utils/loadCsvData';

export function useClaimsData() {
  const [allData, setAllData] = useState<ClaimData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadCsvData()
      .then(data => {
        setAllData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load CSV data:', err);
        setError('Failed to load data');
        setIsLoading(false);
      });
  }, []);
  const [filters, setFilters] = useState<FilterState>({
    injuryGroup: 'all',
    county: 'all',
    severity: 'all',
    caution: 'all',
    venueRating: 'all',
    impactLife: 'all',
    year: 'all'
  });

  const filteredData = useMemo(() => {
    return allData.filter(claim => {
      if (filters.injuryGroup !== 'all' && claim.injury_group !== filters.injuryGroup) return false;
      if (filters.county !== 'all' && claim.county !== filters.county) return false;
      if (filters.venueRating !== 'all' && claim.venue_rating !== filters.venueRating) return false;
      if (filters.impactLife !== 'all' && claim.impact_life !== parseInt(filters.impactLife)) return false;
      if (filters.year !== 'all' && !claim.claim_date.startsWith(filters.year)) return false;
      
      if (filters.severity !== 'all') {
        if (filters.severity === 'low' && claim.severity > 5) return false;
        if (filters.severity === 'medium' && (claim.severity <= 5 || claim.severity > 10)) return false;
        if (filters.severity === 'high' && claim.severity <= 10) return false;
      }
      
      if (filters.caution !== 'all') {
        if (filters.caution === 'low' && claim.caution_score > 3) return false;
        if (filters.caution === 'medium' && (claim.caution_score <= 3 || claim.caution_score > 7)) return false;
        if (filters.caution === 'high' && claim.caution_score <= 7) return false;
      }
      
      return true;
    });
  }, [allData, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const counties = useMemo(() => {
    const uniqueCounties = [...new Set(allData.map(d => d.county))];
    return uniqueCounties.sort();
  }, [allData]);

  return { filteredData, filters, updateFilter, counties, isLoading, error };
}
