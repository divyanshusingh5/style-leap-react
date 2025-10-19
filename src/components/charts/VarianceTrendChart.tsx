import { ClaimData } from "@/types/claims";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface VarianceTrendChartProps {
  data: ClaimData[];
}

export function VarianceTrendChart({ data }: VarianceTrendChartProps) {
  const monthlyData: { [key: string]: { count: number; sumVariance: number } } = {};
  
  data.forEach(d => {
    const month = d.claim_date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, sumVariance: 0 };
    }
    monthlyData[month].count++;
    monthlyData[month].sumVariance += Math.abs(d.variance_pct);
  });
  
  const chartData = Object.keys(monthlyData)
    .sort()
    .map(month => ({
      month,
      variance: (monthlyData[month].sumVariance / monthlyData[month].count).toFixed(1)
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          label={{ value: 'Variance (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="variance" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
