import { ClaimData } from "@/types/claims";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid, Cell } from "recharts";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react";

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

  const countyAnalysis = useMemo(() => {
    const counties: { 
      [key: string]: { 
        signedVariance: number;
        absVariance: number;
        count: number;
        settlement: number;
        overpredicted: number;
        underpredicted: number;
        avgSeverity: number;
        avgCaution: number;
        liberalCount: number;
        conservativeCount: number;
      } 
    } = {};
    
    data.forEach(claim => {
      if (!counties[claim.county]) {
        counties[claim.county] = { 
          signedVariance: 0, 
          absVariance: 0,
          count: 0, 
          settlement: 0,
          overpredicted: 0,
          underpredicted: 0,
          avgSeverity: 0,
          avgCaution: 0,
          liberalCount: 0,
          conservativeCount: 0
        };
      }
      
      counties[claim.county].signedVariance += claim.variance_pct;
      counties[claim.county].absVariance += Math.abs(claim.variance_pct);
      counties[claim.county].count += 1;
      counties[claim.county].settlement += claim.final_settlement;
      counties[claim.county].avgSeverity += claim.severity;
      counties[claim.county].avgCaution += claim.caution_score;
      
      if (claim.variance_pct > 0) {
        counties[claim.county].underpredicted += 1;
        if (claim.variance_pct > 15) counties[claim.county].liberalCount += 1;
      } else {
        counties[claim.county].overpredicted += 1;
        if (claim.variance_pct < -15) counties[claim.county].conservativeCount += 1;
      }
    });

    return Object.entries(counties)
      .map(([name, stats]) => {
        const avgSignedVariance = stats.signedVariance / stats.count;
        const avgAbsVariance = stats.absVariance / stats.count;
        const underpredictRate = (stats.underpredicted / stats.count) * 100;
        
        let tendency = 'Neutral';
        let tendencyBadge: 'destructive' | 'success' | 'default' = 'default';
        
        if (avgSignedVariance > 10 && underpredictRate > 55) {
          tendency = 'Liberal';
          tendencyBadge = 'destructive';
        } else if (avgSignedVariance < -10 && underpredictRate < 45) {
          tendency = 'Conservative';
          tendencyBadge = 'success';
        }
        
        return {
          name,
          state: data.find(d => d.county === name)?.state || '',
          avgSignedVariance,
          avgAbsVariance,
          avgSettlement: stats.settlement / stats.count,
          avgSeverity: stats.avgSeverity / stats.count,
          avgCaution: stats.avgCaution / stats.count,
          count: stats.count,
          underpredictRate,
          tendency,
          tendencyBadge,
          liberalCount: stats.liberalCount,
          conservativeCount: stats.conservativeCount
        };
      })
      .sort((a, b) => b.avgAbsVariance - a.avgAbsVariance);
  }, [data]);

  const highVarianceCounties = useMemo(() => {
    return countyAnalysis.filter(c => c.avgAbsVariance > 20).slice(0, 10);
  }, [countyAnalysis]);

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

      <div className="bg-warning/10 rounded-xl p-6 border border-warning/20 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <h3 className="font-semibold text-warning mb-2">High Variance County Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Counties marked as <span className="font-semibold text-destructive">Liberal</span> tend to award settlements significantly higher than predicted (underprediction). 
              Counties marked as <span className="font-semibold text-success">Conservative</span> tend to award lower than predicted (overprediction). 
              This analysis considers variance patterns, settlement amounts, severity, and caution scores across all claims.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">County Variance & Tendency Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">County</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">State</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tendency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Avg Variance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Underprediction Rate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Avg Settlement</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Avg Severity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Claims</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Insight</th>
              </tr>
            </thead>
            <tbody>
              {highVarianceCounties.map((county) => (
                <tr key={county.name} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{county.name}</td>
                  <td className="px-4 py-3 text-sm">{county.state}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={county.tendencyBadge}>
                      {county.tendency === 'Liberal' && <TrendingUp className="h-3 w-3 mr-1 inline" />}
                      {county.tendency === 'Conservative' && <TrendingDown className="h-3 w-3 mr-1 inline" />}
                      {county.tendency}
                    </Badge>
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold ${
                    county.avgSignedVariance > 0 ? 'text-destructive' : 'text-success'
                  }`}>
                    {county.avgSignedVariance > 0 ? '+' : ''}{county.avgSignedVariance.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm">{county.underpredictRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm">${Math.round(county.avgSettlement).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{county.avgSeverity.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">{county.count}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="text-xs text-muted-foreground max-w-xs">
                      {county.tendency === 'Liberal' && (
                        <span>
                          Model underpredicts by {Math.abs(county.avgSignedVariance).toFixed(1)}%. 
                          Consider increasing predictions by {Math.round(Math.abs(county.avgSignedVariance) * 0.8)}% for this venue.
                        </span>
                      )}
                      {county.tendency === 'Conservative' && (
                        <span>
                          Model overpredicts by {Math.abs(county.avgSignedVariance).toFixed(1)}%. 
                          Consider reducing predictions by {Math.round(Math.abs(county.avgSignedVariance) * 0.8)}% for this venue.
                        </span>
                      )}
                      {county.tendency === 'Neutral' && (
                        <span>Variance is balanced. Monitor for emerging patterns.</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">County Variance Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={highVarianceCounties}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Variance (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                      <p className="font-semibold mb-1">{data.name}, {data.state}</p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Avg Variance: </span>
                        <span className={data.avgSignedVariance > 0 ? 'text-destructive font-semibold' : 'text-success font-semibold'}>
                          {data.avgSignedVariance > 0 ? '+' : ''}{data.avgSignedVariance.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Tendency: </span>
                        <span className="font-semibold">{data.tendency}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Claims: </span>
                        <span>{data.count}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avgSignedVariance" name="Avg Signed Variance (%)">
              {highVarianceCounties.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.avgSignedVariance > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--success))'} 
                />
              ))}
            </Bar>
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
