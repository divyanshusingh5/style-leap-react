import { ClaimData } from "@/types/claims";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

interface SeverityChartProps {
  data: ClaimData[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export function SeverityChart({ data }: SeverityChartProps) {
  const severityRanges: { [key: string]: number } = { 
    'Low (1-5)': 0, 
    'Medium (6-10)': 0, 
    'High (11-15)': 0 
  };
  
  data.forEach(d => {
    if (d.severity <= 5) severityRanges['Low (1-5)']++;
    else if (d.severity <= 10) severityRanges['Medium (6-10)']++;
    else severityRanges['High (11-15)']++;
  });
  
  const chartData = Object.entries(severityRanges).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={(entry) => `${entry.name}: ${entry.value}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
