import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "active" | "inactive" | "pending" | "draft" | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-emerald-50 text-[#2e7d32] border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 font-medium text-[11px] px-2 py-0 rounded leading-5",
          className
        )}
      >
        Active
      </Badge>
    );
  }

  if (normalized === "inactive") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-muted text-muted-foreground border-border font-medium text-[11px] px-2 py-0 rounded leading-5",
          className
        )}
      >
        Inactive
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2 py-0 rounded leading-5",
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
