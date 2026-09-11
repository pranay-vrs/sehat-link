import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Stethoscope, 
  Calendar, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ReferralStatus, Priority } from '../../types';

interface StatusBadgeProps {
  status?: ReferralStatus;
  priority?: Priority;
  isAtRisk?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  priority, 
  isAtRisk, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  if (isAtRisk) {
    return (
      <span className={`inline-flex items-center rounded-full bg-red-100 text-red-800 border border-red-300 shadow-sm animate-pulse ${sizeClasses[size]} ${className}`}>
        <AlertTriangle className={size === 'sm' ? 'w-3 h-3 text-red-600' : 'w-3.5 h-3.5 text-red-600'} />
        <span>Referral at Risk</span>
      </span>
    );
  }

  if (priority) {
    if (priority === 'urgent') {
      return (
        <span className={`inline-flex items-center rounded-full bg-red-50 text-red-700 border border-red-200 ${sizeClasses[size]} ${className}`}>
          <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-red-600' : 'w-3.5 h-3.5 text-red-600'} />
          <span>🔴 Urgent Priority</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]} ${className}`}>
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
        <span>🟢 Routine Priority</span>
      </span>
    );
  }

  switch (status) {
    case 'created':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses[size]} ${className}`}>
          <Clock className={size === 'sm' ? 'w-3 h-3 text-slate-500' : 'w-3.5 h-3.5 text-slate-500'} />
          <span>⚪ Created</span>
        </span>
      );
    case 'accepted':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses[size]} ${className}`}>
          <Clock className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span>🟡 Accepted — Waiting Arrival</span>
        </span>
      );
    case 'arrived':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses[size]} ${className}`}>
          <UserCheck className={size === 'sm' ? 'w-3 h-3 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} />
          <span>🔵 Arrived at Facility</span>
        </span>
      );
    case 'consulted':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses[size]} ${className}`}>
          <Stethoscope className={size === 'sm' ? 'w-3 h-3 text-indigo-600' : 'w-3.5 h-3.5 text-indigo-600'} />
          <span>🟣 Consulted</span>
        </span>
      );
    case 'followup':
      return (
        <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-800 border border-orange-300 ${sizeClasses[size]} ${className}`}>
          <Calendar className={size === 'sm' ? 'w-3 h-3 text-orange-600' : 'w-3.5 h-3.5 text-orange-600'} />
          <span>🟠 Follow-up Due</span>
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClasses[size]} ${className}`}>
          <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-emerald-700' : 'w-3.5 h-3.5 text-emerald-700'} />
          <span>🟢 Care Completed ✅</span>
        </span>
      );
    default:
      return null;
  }
};
