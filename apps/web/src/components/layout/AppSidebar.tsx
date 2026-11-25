"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navigationConfig } from "@/config/navigation";
import {
  IconChevronRight,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile, setOpen, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

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

  // Map sidebar href prefixes to guide module IDs
  const hrefToGuide: Record<string, string> = {
    "/sales": "sales",
    "/customers": "sales",
    "/purchases": "purchases",
    "/banking": "banking",
    "/accounting": "accountant",
    "/inventory": "inventory",
    "/expenses": "expenses",
    "/taxation": "gst",
    "/assets": "assets",
    "/reports": "reports",
    "/automation": "automation",
    "/settings": "sales",
  };

  const handleComingSoon = (title: string, href: string) => {
    // Find guide module for this href
    const matched = Object.entries(hrefToGuide).find(([prefix]) => href.startsWith(prefix));
    const guideId = matched ? matched[1] : null;
    if (guideId) {
      router.push(`/guide/${guideId}`);
    }
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
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground select-none"
    >
      {/* Nav Content */}
      <SidebarContent className="py-2.5 px-2 overflow-y-auto overflow-x-hidden">
        <SidebarMenu className="gap-1">
          {navigationConfig.map((group) => {
            const hasSubItems = Boolean(group.items && group.items.length > 0);
            const directActive = !hasSubItems && isDirectActive(group.href);
            const groupActive =
              hasSubItems && group.items?.some((item) => isSubActive(item.href));
            const isOpen = openGroup === group.title;
            const Icon = group.icon;

            /* ── COLLAPSED ICON RAIL (Zoho Books Style) ── */
            if (isCollapsed) {
              const active = directActive || groupActive;
              const buttonContent = (
                <div className="relative flex flex-col items-center justify-center gap-1 py-2 px-1 w-full">
                  <Icon className="size-5 shrink-0" stroke={1.75} />
                  <span className="text-[10.5px] leading-tight truncate max-w-[60px] text-center font-medium">
                    {group.shortTitle ?? group.title}
                  </span>
                  {hasSubItems && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1 right-1 size-0 border-b-[5px] border-l-[5px] border-l-transparent ${
                        active ? "border-b-white/80" : "border-b-muted-foreground/60"
                      }`}
                    />
                  )}
                </div>
              );

              return (
                <SidebarMenuItem key={group.title} className="flex justify-center">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        !hasSubItems ? (
                          <Link
                            href={group.href || "/dashboard"}
                            onClick={handleNavClick}
                            className={`flex w-full rounded-lg transition-colors ${
                              active
                                ? "bg-primary text-white shadow-xs"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            {buttonContent}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(true);
                              setOpenGroup(group.title);
                            }}
                            className={`flex w-full rounded-lg transition-colors cursor-pointer ${
                              active
                                ? "bg-primary text-white shadow-xs"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            {buttonContent}
                          </button>
                        )
                      }
                    />
                    <TooltipContent side="right" className="text-[12px] font-medium">
                      {group.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              );
            }

            /* ── EXPANDED SIDEBAR (Direct Link, e.g. Home) ── */
            if (!hasSubItems) {
              return (
                <SidebarMenuItem key={group.title}>
                  <Link
                    href={group.href || "/dashboard"}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 w-full px-3 h-10 rounded-lg text-[14px] transition-colors ${
                      directActive
                        ? "bg-primary text-white font-medium shadow-xs"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal"
                    }`}
                  >
                    <Icon
                      className={`size-[19px] shrink-0 ${
                        directActive ? "text-white" : "text-muted-foreground"
                      }`}
                      stroke={1.75}
                    />
                    <span className="truncate">{group.title}</span>
                  </Link>
                </SidebarMenuItem>
              );
            }

            /* ── EXPANDED SIDEBAR (Exclusive Accordion Dropdown) ── */
            return (
              <SidebarMenuItem key={group.title}>
                <button
                  type="button"
                  onClick={() => handleToggleGroup(group.title)}
                  aria-expanded={isOpen}
                  className={`flex items-center gap-2 w-full px-2.5 h-10 rounded-lg text-[14px] transition-colors cursor-pointer ${
                    groupActive
                      ? "text-primary font-semibold bg-accent/70"
                      : isOpen
                        ? "text-foreground font-medium bg-sidebar-accent/70"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal"
                  }`}
                >
                  <IconChevronRight
                    className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out ${
                      isOpen ? "rotate-90 text-foreground" : ""
                    }`}
                    stroke={2}
                  />
                  <Icon
                    className={`size-[19px] shrink-0 ${
                      groupActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    stroke={1.75}
                  />
                  <span className="truncate">{group.title}</span>
                </button>

                {/* Smooth Animated Submenu */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`${group.title}-submenu`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="py-1 pl-7 pr-1 space-y-0.5">
                        {group.items?.map((subItem) => {
                          const subActive = isSubActive(subItem.href);

                          if (subItem.isComingSoon) {
                            return (
                              <button
                                key={subItem.title}
                                type="button"
                                onClick={() => handleComingSoon(subItem.title, subItem.href)}
                                className="flex items-center justify-between w-full px-2.5 h-8.5 rounded-md text-[13.5px] text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
                              >
                                <span className="truncate">{subItem.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono leading-none shrink-0">
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
                              className={`flex items-center w-full px-2.5 h-8.5 rounded-md text-[13.5px] transition-colors ${
                                subActive
                                  ? "bg-primary text-white font-medium shadow-xs"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              }`}
                            >
                              <span className="truncate">{subItem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom Collapse/Expand Rail Toggle (Desktop) */}
      <SidebarFooter className="hidden md:flex border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex items-center w-full h-9 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : "justify-between px-2.5"
          }`}
        >
          {!isCollapsed && <span className="font-medium">Collapse</span>}
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand className="size-5" stroke={1.75} />
          ) : (
            <IconLayoutSidebarLeftCollapse className="size-5" stroke={1.75} />
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
