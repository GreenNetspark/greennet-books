"use client";

import React, { useState, useEffect } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { navigationConfig } from "@/config/navigation";
import { BookOpenCheck, ChevronDown, ChevronRight } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Single-open exclusive accordion: only 1 module section open at a time
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const matched = navigationConfig.find((group) =>
      group.items?.some(
        (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
      )
    );
    return matched?.title ?? "Sales";
  });

  // Sync open section when route changes
  useEffect(() => {
    const matched = navigationConfig.find((group) =>
      group.items?.some(
        (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
      )
    );
    if (matched) {
      setOpenGroup(matched.title);
    }
  }, [pathname]);

  const handleToggleGroup = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleComingSoon = (title: string) => {
    toast.info(`${title} is planned for upcoming development phases.`, {
      id: "coming-soon",
    });
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isDirectActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const isSubActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      style={{ "--sidebar-width": "220px" } as React.CSSProperties}
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border px-4 h-12 flex flex-row items-center gap-3 shrink-0">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
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
        <SidebarMenu className="gap-0.5 px-0">
          {navigationConfig.map((group) => {
            const hasSubItems = group.items && group.items.length > 0;

            if (!hasSubItems) {
              const active = isDirectActive(group.href);
              return (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton
                    render={<Link href={group.href || "/dashboard"} onClick={handleNavClick} />}
                    isActive={active}
                    className={`flex items-center gap-2.5 w-full px-4 py-0 h-9 text-[13px] rounded-none transition-colors
                      ${
                        active
                          ? "bg-accent text-sidebar-primary font-medium border-l-[3px] border-sidebar-primary pl-[13px]"
                          : "text-sidebar-foreground hover:bg-muted/60 border-l-[3px] border-transparent pl-[13px]"
                      }`}
                  >
                    <group.icon
                      className={`size-4 shrink-0 ${
                        active ? "text-sidebar-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>{group.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            const isOpen = openGroup === group.title;
            const isGroupActive = group.items?.some((item) => isSubActive(item.href));

            return (
              <SidebarMenuItem key={group.title}>
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => handleToggleGroup(group.title)}
                  aria-expanded={isOpen}
                  className={`flex items-center justify-between w-full px-4 h-9 text-[13px] transition-colors cursor-pointer border-l-[3px] pl-[13px]
                    ${
                      isGroupActive || isOpen
                        ? "text-foreground font-medium border-transparent bg-muted/30"
                        : "text-sidebar-foreground hover:bg-muted/60 border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <group.icon
                      className={`size-4 shrink-0 ${
                        isGroupActive || isOpen ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate">{group.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Dropdown Sub-items (only rendered when this group is open) */}
                {isOpen && (
                  <div className="py-0.5 bg-muted/15 border-b border-border/40">
                    {group.items?.map((subItem) => {
                      const subActive = isSubActive(subItem.href);

                      if (subItem.isComingSoon) {
                        return (
                          <button
                            key={subItem.title}
                            type="button"
                            onClick={() => handleComingSoon(subItem.title)}
                            className="flex items-center justify-between w-full px-4 pl-10 h-8 text-[12.5px] text-muted-foreground/75 hover:bg-muted/50 hover:text-sidebar-foreground transition-colors border-l-[3px] border-transparent cursor-pointer"
                          >
                            <span className="truncate">{subItem.title}</span>
                            <span className="text-[10px] px-1 rounded bg-muted text-muted-foreground font-mono leading-4 shrink-0">
                              soon
                            </span>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          onClick={handleNavClick}
                          className={`flex items-center w-full px-4 pl-10 h-8 text-[12.5px] transition-colors
                            ${
                              subActive
                                ? "bg-accent text-sidebar-primary font-medium border-l-[3px] border-sidebar-primary pl-[37px]"
                                : "text-sidebar-foreground hover:bg-muted/60 border-l-[3px] border-transparent pl-[37px]"
                            }`}
                        >
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
