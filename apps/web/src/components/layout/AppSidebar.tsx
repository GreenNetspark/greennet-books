"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigationConfig } from "@/config/navigation";
import { BookOpenCheck } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const handleComingSoon = (title: string) => {
    toast.info(`${title} is planned for upcoming development phases.`);
  };

  const isActive = (item: (typeof navigationConfig)[0]) => {
    if (item.items && item.items.length > 0) return false;
    if (item.href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href ?? ""));
  };

  const isSubActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      style={{ "--sidebar-width": "220px" } as React.CSSProperties}
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border px-4 h-12 flex flex-row items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground shadow-sm group-hover:opacity-90 transition-opacity">
            <BookOpenCheck className="size-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-[13px] text-sidebar-foreground leading-tight">
              GreenNet Books
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              Smart Accounting
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Nav Content */}
      <SidebarContent className="py-2 overflow-y-auto">
        <SidebarMenu className="gap-0 px-0">
          {navigationConfig.map((group) => {
            const hasSubItems = group.items && group.items.length > 0;

            if (!hasSubItems) {
              // Direct link (e.g. Dashboard)
              const active = isActive(group);
              return (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton
                    render={<Link href={group.href || "/dashboard"} />}
                    isActive={active}
                    className={`flex items-center gap-2.5 w-full px-4 py-0 h-9 text-[13px] font-normal rounded-none transition-none
                      ${active
                        ? "bg-accent text-sidebar-primary font-medium border-l-[3px] border-sidebar-primary pl-[13px]"
                        : "text-sidebar-foreground hover:bg-muted/60 border-l-[3px] border-transparent pl-[13px]"
                      }`}
                  >
                    <group.icon className={`size-4 shrink-0 ${active ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                    <span>{group.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Section with sub-items
            return (
              <SidebarMenuItem key={group.title} className="mt-3 first:mt-1">
                {/* Section Label */}
                <div className="flex items-center gap-2.5 px-4 py-1 mb-0.5">
                  <group.icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.title}
                  </span>
                </div>

                {/* Sub-items */}
                {group.items?.map((subItem) => {
                  const subActive = isSubActive(subItem.href);

                  if (subItem.isComingSoon) {
                    return (
                      <button
                        key={subItem.title}
                        type="button"
                        onClick={() => handleComingSoon(subItem.title)}
                        className="flex items-center justify-between w-full px-4 pl-10 h-8 text-[13px] text-muted-foreground/60 hover:bg-muted/50 hover:text-sidebar-foreground transition-colors border-l-[3px] border-transparent cursor-pointer"
                      >
                        <span>{subItem.title}</span>
                        <span className="text-[10px] px-1 rounded bg-muted/40 text-muted-foreground font-mono leading-4">
                          soon
                        </span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={`flex items-center w-full px-4 pl-10 h-8 text-[13px] transition-colors
                        ${subActive
                          ? "bg-accent text-sidebar-primary font-medium border-l-[3px] border-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-muted/60 border-l-[3px] border-transparent"
                        }`}
                    >
                      {subItem.title}
                    </Link>
                  );
                })}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
