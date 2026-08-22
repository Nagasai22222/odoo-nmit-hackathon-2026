import React from 'react';
import { cn } from '../../utils/cn';

const StatusBadge = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
      case 'rejected':
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'half-day':
      case 'sick':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'leave':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      getStatusStyles(),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
