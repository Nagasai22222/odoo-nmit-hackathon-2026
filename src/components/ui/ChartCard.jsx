import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, height = 300 }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
