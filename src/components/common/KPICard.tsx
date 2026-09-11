import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  tone?: 'default' | 'urgent' | 'warning' | 'success';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  tone = 'default',
  onClick
}) => {
  const toneClasses = {
    default: 'border-slate-200 bg-white text-slate-900',
    urgent: 'border-red-200 bg-red-50/50 text-slate-900 hover:border-red-300',
    warning: 'border-amber-200 bg-amber-50/40 text-slate-900 hover:border-amber-300',
    success: 'border-emerald-200 bg-emerald-50/40 text-slate-900 hover:border-emerald-300'
  };

  const iconBgClasses = {
    default: 'bg-teal-50 text-teal-700 border-teal-100',
    urgent: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border p-4 shadow-sm transition-all duration-200 ${toneClasses[tone]} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconBgClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span className={`font-medium ${
              trendType === 'positive' ? 'text-emerald-700' : 
              trendType === 'negative' ? 'text-red-700' : 'text-slate-600'
            }`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
