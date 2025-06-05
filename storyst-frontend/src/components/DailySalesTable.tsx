import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import type { DailySalesStatistic } from '@/api/statisticsService';

interface DailySalesTableProps {
  statistics: DailySalesStatistic[];
}

const DailySalesTable: React.FC<DailySalesTableProps> = ({ statistics }) => {
  const totalSales = statistics.reduce((sum, stat) => sum + stat.totalSales, 0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vendas Diárias</CardTitle>
        <CardDescription>Histórico de vendas por dia</CardDescription>
      </CardHeader>
      <CardContent>
        {statistics.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(stat.date)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(stat.totalSales)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalSales)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <p className="text-center py-4 text-muted-foreground italic">Nenhum dado de venda disponível</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySalesTable;