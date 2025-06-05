import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;