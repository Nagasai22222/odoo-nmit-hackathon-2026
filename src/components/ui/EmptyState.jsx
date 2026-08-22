import React from 'react';
import { FolderX } from 'lucide-react';
import { cn } from '../../utils/cn';

const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new record.",
  icon: Icon = FolderX,
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
