"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  badge,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[18px] font-semibold text-foreground leading-tight truncate">
          {title}
        </h1>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {actions}
        </div>
      )}
    </div>
  );
}
