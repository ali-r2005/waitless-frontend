'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  change,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  bgColor = 'bg-primary/10',
  prefix = '',
  suffix = '',
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <Card className="relative overflow-hidden border bg-card hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-1 tracking-tight">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 mt-2 text-xs font-medium',
                  isPositive && 'text-emerald-500',
                  isNegative && 'text-rose-500',
                  isNeutral && 'text-muted-foreground',
                )}
              >
                {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                {isNeutral && <Minus className="h-3.5 w-3.5" />}
                <span>
                  {isPositive ? '+' : ''}{change}% vs yesterday
                </span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3 ml-4 shrink-0 group-hover:scale-110 transition-transform duration-300', bgColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
      {/* subtle accent bar */}
      <div className={cn('absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500', bgColor.replace('/10', '/60'))} />
    </Card>
  );
}
