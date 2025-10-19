import { ClaimData } from "@/types/claims";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface ActualVsPredictedChartProps {
  data: ClaimData[];
}

export function ActualVsPredictedChart({ data }: ActualVsPredictedChartProps) {
  const monthlyData: { [key: string]: { actual: number; predicted: number; count: number } } = {};
  
  data.forEach(d => {
    const month = d.claim_date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { actual: 0, predicted: 0, count: 0 };
    }
    monthlyData[month].actual += d.final_settlement;
    monthlyData[month].predicted += d.predicted_pain_suffering;
    monthlyData[month].count++;
  });
  
  const chartData = Object.keys(monthlyData)
    .sort()
    .map(month => ({
      month,
      actual: Math.round(monthlyData[month].actual / monthlyData[month].count),
      predicted: Math.round(monthlyData[month].predicted / monthlyData[month].count)
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
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="actual" 
          name="Actual Settlement"
          stroke="hsl(var(--chart-2))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          name="Predicted Settlement"
          stroke="hsl(var(--chart-3))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
