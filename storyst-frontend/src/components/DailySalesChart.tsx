'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { DailySalesStatistic } from '@/api/statisticsService';

interface DailySalesChartProps {
  statistics: DailySalesStatistic[];
}

const DailySalesChart: React.FC<DailySalesChartProps> = ({ statistics }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const chartData = statistics.map(stat => ({
    date: formatDate(stat.date),
    vendas: stat.totalSales,
    dateRaw: stat.date
  }))
  .sort((a, b) => new Date(a.dateRaw).getTime() - new Date(b.dateRaw).getTime());

  const chartConfig = {
    vendas: {
      label: 'Vendas',
      color: 'hsl(var(--primary))'
    }
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `R$${(value / 1000).toFixed(1)}k`;
    }
    return `R$${value}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Vendas Diárias</CardTitle>
        <CardDescription>Visualização gráfica das vendas por dia</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 h-full">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              barSize={30}
              width={undefined}
              height={undefined}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                height={30}
                stroke="var(--muted-foreground)"
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={true}
                tickMargin={5}
                width={40}
                stroke="var(--muted-foreground)"
                fontSize={10}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="vendas" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={36}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { date: string } }[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <ChartTooltipContent>
        <div className="space-y-1">
          <p className="text-sm font-medium">{data.date}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </div>
      </ChartTooltipContent>
    );
  }
  return null;
};

export default DailySalesChart;