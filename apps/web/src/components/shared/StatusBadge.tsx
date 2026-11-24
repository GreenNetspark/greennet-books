import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "active" | "inactive" | "pending" | "draft" | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 gap-1.5 font-medium text-xs px-2.5 py-0.5",
          className
        )}
      >
        {/* Solid honest indicator: no fake pulsing per craft-floor rule */}
        {showIcon && (
          <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
        )}
        Active
      </Badge>
    );
  }

  if (normalized === "inactive") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 gap-1.5 font-medium text-xs px-2.5 py-0.5",
          className
        )}
      >
        {showIcon && <span className="size-1.5 rounded-full bg-slate-500 shrink-0" />}
        Inactive
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium gap-1.5 px-2.5 py-0.5", className)}
    >
      {showIcon && <span className="size-1.5 rounded-full bg-muted-foreground shrink-0" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
