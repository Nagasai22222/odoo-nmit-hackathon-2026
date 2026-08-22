import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/cn';

const DashboardCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, colorClass = "text-primary-600 bg-primary-50" }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-xl", colorClass)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
        
        {(subtitle || trend) && (
          <div className="mt-4 flex items-center text-sm">
            {trend && (
              <span className={cn(
                "font-medium mr-2",
                trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-600" : "text-slate-600"
              )}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
