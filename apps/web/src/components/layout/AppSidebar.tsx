"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { navigationConfig } from "@/config/navigation";
import { ChevronDown, ChevronRight, BookOpenCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();

  // Track open state for expandable groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      Overview: true,
      Sales: true,
    };
    navigationConfig.forEach((group) => {
      if (group.defaultOpen) {
        initial[group.title] = true;
      }
      if (group.items?.some((item) => pathname.startsWith(item.href))) {
        initial[group.title] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleComingSoon = (title: string) => {
    toast.info(`${title} is planned for upcoming development phases.`);
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <BookOpenCheck className="size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-sidebar-foreground">
                GreenNet Books
              </span>
              <Badge className="h-4 px-1 text-[9px] font-semibold bg-sidebar-primary/20 text-sidebar-primary border-none">
                PRO
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground/80">
              Smart Accounting for India
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Nav Content */}
      <SidebarContent className="px-2 py-3 space-y-1">
        <SidebarMenu>
          {navigationConfig.map((group) => {
            const hasSubItems = group.items && group.items.length > 0;
            const isOpen = !!openGroups[group.title];
            const isGroupActive = hasSubItems
              ? group.items?.some((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
              : pathname === group.href;

            if (!hasSubItems) {
              // Direct single link (like Dashboard)
              const isActive = pathname === group.href || (group.href === "/dashboard" && pathname === "/");
              return (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton
                    render={<Link href={group.href || "/dashboard"} />}
                    isActive={isActive}
                    className={`gap-3 text-xs font-medium rounded-md px-3 py-2 transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs"
                        : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    }`}
                  >
                    <group.icon className={`size-4 shrink-0 ${isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}`} />
                    <span>{group.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Expandable Group
            return (
              <SidebarMenuItem key={group.title} className="space-y-0.5">
                <SidebarMenuButton
                  onClick={() => toggleGroup(group.title)}
                  className={`w-full justify-between gap-3 text-xs font-medium rounded-md px-3 py-2 transition-colors ${
                    isGroupActive
                      ? "text-sidebar-foreground font-semibold"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className={`size-4 shrink-0 ${isGroupActive ? "text-sidebar-primary" : "text-muted-foreground"}`} />
                    <span>{group.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="size-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-3 text-muted-foreground" />
                  )}
                </SidebarMenuButton>

                {isOpen && group.items && (
                  <SidebarMenuSub className="ml-4 pl-3 border-l border-sidebar-border/40 space-y-0.5">
                    {group.items.map((subItem) => {
                      const isSubActive = pathname === subItem.href || (subItem.href === "/customers" && pathname.startsWith("/customers"));

                      if (subItem.isComingSoon) {
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => handleComingSoon(subItem.title)}
                              className="text-xs py-1.5 px-2 text-muted-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer flex items-center justify-between rounded-md"
                            >
                              <span>{subItem.title}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-muted/20 text-muted-foreground font-mono">
                                soon
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      }

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            render={<Link href={subItem.href} />}
                            isActive={isSubActive}
                            className={`text-xs py-1.5 px-2.5 rounded-md transition-colors ${
                              isSubActive
                                ? "bg-sidebar-primary/20 text-sidebar-primary font-semibold"
                                : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/40 border border-sidebar-border/40 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-sidebar-primary">
            <Sparkles className="size-3.5" />
            <span>AI Assistant</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
            Automated GST and bank reconciliation engine active.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
