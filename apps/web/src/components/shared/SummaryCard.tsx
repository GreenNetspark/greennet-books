import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName = "text-primary",
  trend,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-xs", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div className="p-1.5 rounded-md bg-muted/60">
              <Icon className={cn("size-4", iconClassName)} />
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-foreground">
            {value}
          </div>
          {trend && (
            <span
              className={cn(
                "text-[11px] font-medium px-1.5 py-0.5 rounded",
                trend.isPositive
                  ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-[11px] text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
