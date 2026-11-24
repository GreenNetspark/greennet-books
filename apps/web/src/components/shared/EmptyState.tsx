import React from "react";
import { LucideIcon, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center py-6 px-2 text-left",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
        <Icon className="size-4" />
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      </div>
      {description && (
        <p className="max-w-md text-[13px] text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
