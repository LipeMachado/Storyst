import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { DailySalesStatistic } from '@/api/statisticsService';

interface DailySalesTableProps {
  statistics: DailySalesStatistic[];
}

const DailySalesTable: React.FC<DailySalesTableProps> = ({ statistics }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const salesPerPage = 6;

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredStatistics, setFilteredStatistics] = useState<DailySalesStatistic[]>(statistics);

  useEffect(() => {
    setFilteredStatistics(statistics);
  }, [statistics]);

  const applyFilters = () => {
    let filtered = [...statistics];

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(stat => new Date(stat.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(stat => new Date(stat.date) <= end);
    }

    setFilteredStatistics(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilteredStatistics(statistics);
    setCurrentPage(1);
  };

  const totalSales = filteredStatistics.reduce((sum, stat) => sum + stat.totalSales, 0);

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

  const totalPages = Math.ceil(filteredStatistics.length / salesPerPage);
  const currentSales = filteredStatistics.slice(
    (currentPage - 1) * salesPerPage,
    currentPage * salesPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vendas Diárias</CardTitle>
        <CardDescription>Histórico de vendas por dia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col xl:flex-row gap-2 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium block mb-1">Data Inicial</label>
              <div className="relative w-full">
                <div className="flex items-center justify-between border border-input rounded-md overflow-hidden h-9 bg-transparent">
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-1 outline-none border-0 bg-transparent appearance-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium block mb-1">Data Final</label>
              <div className="relative w-full">
                <div className="flex items-center justify-between border border-input rounded-md overflow-hidden h-9 bg-transparent">
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-1 outline-none border-0 bg-transparent appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={applyFilters}
              className="mt-auto"
            >
              Aplicar Filtro
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-auto"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {filteredStatistics.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSales.map((stat, index) => (
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

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:inline-flex"
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (window.innerWidth < 640) {
                        return page === 1 || page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);
                      }
                      return page === 1 || page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2);
                    })
                    .map(page => (
                      <React.Fragment key={page}>
                        {page > 1 &&
                          ((window.innerWidth < 640 && page === currentPage - 1 && currentPage > 2) ||
                            (window.innerWidth >= 640 && page === currentPage - 2 && currentPage > 3)) &&
                          <span className="px-2">...</span>
                        }

                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>

                        {page < totalPages &&
                          ((window.innerWidth < 640 && page === currentPage + 1 && currentPage < totalPages - 1) ||
                            (window.innerWidth >= 640 && page === currentPage + 2 && currentPage < totalPages - 2)) &&
                          <span className="px-2">...</span>
                        }
                      </React.Fragment>
                    ))
                  }
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:inline-flex"
                >
                  Última
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="text-center text-sm text-muted-foreground mt-2">
                <span>Página {currentPage} de {totalPages}&nbsp;</span>
                <span>- Total de {filteredStatistics.length} vendas</span>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-4 text-muted-foreground italic">Nenhum dado de venda disponível</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySalesTable;