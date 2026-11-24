"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbsProps {
  items?: { label: string; href?: string }[];
}

export function AppBreadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // If explicit items provided, use them
  if (items && items.length > 0) {
    return (
      <Breadcrumb className="text-xs">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" />}>
              <Home className="size-3.5" />
              <span className="sr-only">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="font-medium text-foreground">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={item.href} className="text-muted-foreground hover:text-foreground" />}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Otherwise generate from pathname
  const segments = pathname.split("/").filter(Boolean);
  
  const getLabel = (seg: string) => {
    if (seg === "customers") return "Customers";
    if (seg === "new") return "Create Customer";
    if (seg === "sales") return "Sales";
    if (seg === "dashboard") return "Dashboard";
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  };

  return (
    <Breadcrumb className="text-xs">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" />}>
            <Home className="size-3.5" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const href = "/" + segments.slice(0, idx + 1).join("/");
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {getLabel(seg)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} className="text-muted-foreground hover:text-foreground" />}>
                    {getLabel(seg)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
