import { ClaimData } from "@/types/claims";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid } from "recharts";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface RecommendationsTabProps {
  data: ClaimData[];
}

export function RecommendationsTab({ data }: RecommendationsTabProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const varianceFeatures = useMemo(() => {
    const features: { [key: string]: { variance: number; count: number } } = {};
    
    data.forEach(claim => {
      const key = claim.injury_group;
      if (!features[key]) {
        features[key] = { variance: 0, count: 0 };
      }
      features[key].variance += Math.abs(claim.variance_pct);
      features[key].count += 1;
    });

    return Object.entries(features)
      .map(([name, { variance, count }]) => ({
        name,
        avgVariance: variance / count,
        count
      }))
      .sort((a, b) => b.avgVariance - a.avgVariance)
      .slice(0, 5);
  }, [data]);

  const recommendedAdjusters = useMemo(() => {
    if (!selectedFeature) return [];

    const adjusterStats: { [key: string]: { variance: number; count: number } } = {};
    
    data
      .filter(claim => claim.injury_group === selectedFeature)
      .forEach(claim => {
        if (!adjusterStats[claim.adjuster]) {
          adjusterStats[claim.adjuster] = { variance: 0, count: 0 };
        }
        adjusterStats[claim.adjuster].variance += Math.abs(claim.variance_pct);
        adjusterStats[claim.adjuster].count += 1;
      });

    return Object.entries(adjusterStats)
      .map(([name, { variance, count }]) => ({
        name,
        avgVariance: variance / count,
        count
      }))
      .sort((a, b) => a.avgVariance - b.avgVariance)
      .slice(0, 5);
  }, [data, selectedFeature]);

  const countyPerformance = useMemo(() => {
    const counties: { [key: string]: { variance: number; count: number; settlement: number } } = {};
    
    data.forEach(claim => {
      if (!counties[claim.county]) {
        counties[claim.county] = { variance: 0, count: 0, settlement: 0 };
      }
      counties[claim.county].variance += Math.abs(claim.variance_pct);
      counties[claim.county].count += 1;
      counties[claim.county].settlement += claim.final_settlement;
    });

    return Object.entries(counties)
      .map(([name, { variance, count, settlement }]) => ({
        name,
        avgVariance: variance / count,
        avgSettlement: settlement / count,
        count
      }))
      .sort((a, b) => b.avgVariance - a.avgVariance);
  }, [data]);

  const temporalData = useMemo(() => {
    const monthly: { [key: string]: { variance: number; count: number } } = {};
    
    data.forEach(claim => {
      const month = claim.claim_date.substring(0, 7);
      if (!monthly[month]) {
        monthly[month] = { variance: 0, count: 0 };
      }
      monthly[month].variance += Math.abs(claim.variance_pct);
      monthly[month].count += 1;
    });

    return Object.entries(monthly)
      .map(([month, { variance, count }]) => ({
        month,
        avgVariance: variance / count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  return (
    <>
      <div className="bg-info/10 rounded-xl p-6 border border-info/20 mb-6">
        <h3 className="font-semibold text-info mb-2">High Variance Feature Detection</h3>
        <p className="text-sm text-muted-foreground">
          Features with highest variance indicate areas where the model struggles most. Click on any feature to see recommended adjusters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h3 className="text-xl font-semibold mb-4">Top Variance Features</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {varianceFeatures.map((feature) => (
              <div
                key={feature.name}
                onClick={() => setSelectedFeature(feature.name)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFeature === feature.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{feature.name}</span>
                  <Badge variant={feature.avgVariance > 30 ? "destructive" : feature.avgVariance > 20 ? "warning" : "default"}>
                    {feature.avgVariance.toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {feature.count} claims
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {selectedFeature ? `Recommended Adjusters for ${selectedFeature}` : 'Select a Feature'}
          </h3>
          {selectedFeature ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recommendedAdjusters.map((adjuster, idx) => (
                <div key={adjuster.name} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-success/20 text-success' :
                      idx === 1 ? 'bg-info/20 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{adjuster.name}</div>
                      <div className="text-xs text-muted-foreground">{adjuster.count} claims handled</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Avg Variance: </span>
                    <span className="font-semibold text-success">{adjuster.avgVariance.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>Click on a feature to see recommended adjusters</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">County Performance Insights</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={countyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="avgVariance" name="Avg Variance (%)" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md">
        <h3 className="text-xl font-semibold mb-4">Temporal Variance Patterns</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={temporalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="avgVariance" name="Avg Variance (%)" stroke="hsl(var(--chart-2))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
