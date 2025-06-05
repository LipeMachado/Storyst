import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import type { TopVolumeCustomer, TopAverageValueCustomer, TopFrequencyCustomer } from '@/api/statisticsService';

type TopCustomerType = TopVolumeCustomer | TopAverageValueCustomer | TopFrequencyCustomer;

interface TopCustomerCardProps {
  title: string;
  description: string;
  customer: TopCustomerType | null;
  valueLabel: string;
  valueFormatter: (customer: TopCustomerType) => string;
}

const TopCustomerCard: React.FC<TopCustomerCardProps> = ({
  title,
  description,
  customer,
  valueLabel,
  valueFormatter
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {customer ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold">
                  {customer.customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{customer.customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.customer.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">Nenhum dado disponível</p>
        )}
      </CardContent>
      {customer && (
        <CardFooter className="border-t pt-4">
          <div className="w-full">
            <p className="text-sm text-muted-foreground">{valueLabel}</p>
            <p className="text-2xl font-bold text-green-700">{valueFormatter(customer)}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TopCustomerCard;