"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconMenu2,
  IconSearch,
  IconPlus,
  IconBell,
  IconSettings,
  IconHelpCircle,
  IconChevronDown,
  IconCheck,
  IconBuilding,
  IconUser,
  IconLogout,
  IconShieldCheck,
  IconUserPlus,
  IconFileInvoice,
  IconReceipt,
  IconCreditCard,
  IconBook,
  IconX,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

const ORGANIZATIONS = [
  { id: "org-1", name: "GreenNet Technologies", gstin: "29AAAAA0000A1Z5", type: "Headquarters" },
  { id: "org-2", name: "GreenNet Retail LLP", gstin: "27BBBBB1111B1Z2", type: "Subsidiary" },
  { id: "org-3", name: "GreenNet Global", gstin: "33CCCCC2222C1Z9", type: "Branch Entity" },
];

export function Topbar() {
  const { toggleSidebar } = useSidebar();
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleOrgChange = (org: typeof ORGANIZATIONS[0]) => {
    setSelectedOrg(org);
    toast.success(`Switched to ${org.name}`, { id: "org-switch" });
  };

  const showComingSoon = (msg: string) => {
    toast.info(msg, { id: "coming-soon" });
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 bg-[#1e2639] text-white border-b border-white/10">
      <div className="flex h-[52px] w-full items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
        {/* Left: Mobile Menu + Brand Logo + Desktop Search */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="flex md:hidden items-center justify-center size-8 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <IconMenu2 className="size-5" stroke={1.75} />
          </button>

          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 shrink-0 focus:outline-none group"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-white shadow-xs group-hover:bg-primary/90 transition-colors">
              <IconBook className="size-5" stroke={1.8} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white hidden sm:inline">
              Books
            </span>
          </Link>

          {/* Desktop Global Search (Zoho Books style) */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-2">
            <div className="relative w-full">
              <IconSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
                stroke={1.75}
              />
              <input
                type="search"
                aria-label="Global search"
                placeholder="Search in Customers ( / )"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    showComingSoon(`Search for "${searchQuery}" coming in Phase 2`);
                  }
                }}
                className="w-full h-8.5 pl-9 pr-3 text-[13.5px] rounded-md bg-white/10 border border-white/15 text-white placeholder:text-slate-300 hover:bg-white/15 focus:bg-white/15 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right: Org Switcher, Blue Quick Create +, Notifications, Settings, Help, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            aria-label="Toggle search"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="flex md:hidden items-center justify-center size-8 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileSearchOpen ? (
              <IconX className="size-5" stroke={1.75} />
            ) : (
              <IconSearch className="size-5" stroke={1.75} />
            )}
          </button>

          {/* Organization Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Switch organization"
                  className="flex items-center gap-1.5 h-8 px-2 sm:px-2.5 text-[13px] font-medium rounded-md text-slate-100 hover:bg-white/10 transition-colors focus-visible:outline-none cursor-pointer"
                />
              }
            >
              <span className="max-w-[95px] sm:max-w-[165px] truncate">{selectedOrg.name}</span>
              <IconChevronDown className="size-3.5 text-slate-300 shrink-0" stroke={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-1">
              <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ORGANIZATIONS.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgChange(org)}
                  className="flex items-start justify-between p-2 cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-[13.5px] text-foreground">{org.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {org.type} · {org.gstin}
                    </div>
                  </div>
                  {selectedOrg.id === org.id && (
                    <IconCheck className="size-4 text-primary shrink-0 mt-0.5" stroke={2} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Zoho Blue '+' Quick Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Quick create"
                  className="flex items-center justify-center size-8 rounded-md bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors cursor-pointer"
                />
              }
            >
              <IconPlus className="size-4.5" stroke={2.25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 text-[13.5px]">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <Link
                    href="/customers/new"
                    className="flex items-center gap-2 py-2 cursor-pointer font-medium text-primary"
                  />
                }
              >
                <IconUserPlus className="size-4" stroke={1.75} />
                <span>New Customer</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showComingSoon("Sales Invoice creation coming in Phase 2")}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <IconFileInvoice className="size-4 text-muted-foreground" stroke={1.75} />
                <span>Sales Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showComingSoon("Vendor Bill creation coming in Phase 2")}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <IconReceipt className="size-4 text-muted-foreground" stroke={1.75} />
                <span>Vendor Bill</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => showComingSoon("Payment recording coming in Phase 2")}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <IconCreditCard className="size-4 text-muted-foreground" stroke={1.75} />
                <span>Record Payment</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="View notifications"
                  className="relative flex items-center justify-center size-8 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                />
              }
            >
              <IconBell className="size-[19px]" stroke={1.75} />
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full ring-2 ring-[#1e2639]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-1.5rem)] sm:w-80 p-0 shadow-lg">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-[14px] font-semibold text-foreground">Notifications</span>
                <Badge variant="secondary" className="text-[11px] h-5">3 New</Badge>
              </div>
              <div className="divide-y divide-border text-[13.5px] max-h-64 overflow-y-auto">
                {[
                  { title: "GST filing due in 4 days", sub: "GSTR-3B for October requires validation", time: "1 hour ago" },
                  { title: "Customer advance allocated", sub: "₹25,000 allocated for Sri Lakshmi Traders", time: "3 hours ago" },
                  { title: "Bank feed synced", sub: "HDFC Bank: 42 transactions imported", time: "Yesterday" },
                ].map((n, i) => (
                  <div key={i} className="p-3 hover:bg-muted/40 cursor-pointer transition-colors">
                    <p className="font-medium text-foreground leading-tight">{n.title}</p>
                    <p className="text-muted-foreground text-[12px] mt-0.5">{n.sub}</p>
                    <span className="text-[11px] text-muted-foreground/70 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <button
            type="button"
            aria-label="Settings"
            onClick={() => showComingSoon("Settings coming soon")}
            className="hidden sm:flex items-center justify-center size-8 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <IconSettings className="size-[19px]" stroke={1.75} />
          </button>

          {/* Help */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Help and support"
                  className="hidden sm:flex items-center justify-center size-8 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                />
              }
            >
              <IconHelpCircle className="size-[19px]" stroke={1.75} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1 text-[13.5px]">
              <DropdownMenuLabel>Help &amp; Support</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => showComingSoon("Documentation coming soon")} className="cursor-pointer">
                Documentation &amp; Guides
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => showComingSoon("GST Compliance Guide coming soon")} className="cursor-pointer">
                Indian GST Compliance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => showComingSoon("CA Support coming soon")} className="cursor-pointer">
                Contact CA Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="User profile menu"
                  className="flex items-center gap-1.5 focus:outline-none cursor-pointer hover:bg-white/10 rounded-md p-1 transition-colors"
                />
              }
            >
              <div className="size-8 rounded-full bg-slate-200 text-[#1e2639] flex items-center justify-center font-semibold text-[12px] shrink-0">
                PB
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-1 text-[13.5px]">
              <div className="p-2.5 border-b border-border">
                <p className="font-semibold text-foreground">Pavan Bhat</p>
                <p className="text-[12px] text-muted-foreground truncate">shreekrishnabhat.km@gmail.com</p>
                <div className="mt-1.5">
                  <Badge variant="outline" className="text-[11px] text-primary border-primary/30 bg-primary/5">
                    <IconShieldCheck className="size-3.5 mr-1" stroke={1.75} /> Organization Owner
                  </Badge>
                </div>
              </div>
              <DropdownMenuGroup className="py-1">
                <DropdownMenuItem onClick={() => showComingSoon("Profile settings coming soon")} className="cursor-pointer">
                  <IconUser className="size-4 mr-2 text-muted-foreground" stroke={1.75} />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => showComingSoon("Organization settings coming soon")} className="cursor-pointer">
                  <IconBuilding className="size-4 mr-2 text-muted-foreground" stroke={1.75} />
                  <span>Organization Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => showComingSoon("Preferences coming soon")} className="cursor-pointer">
                  <IconSettings className="size-4 mr-2 text-muted-foreground" stroke={1.75} />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.success("Sign out simulated", { id: "coming-soon" })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <IconLogout className="size-4 mr-2" stroke={1.75} />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expandable Mobile Search Row */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-white/10 px-3 py-2 bg-[#1e2639]">
          <div className="relative w-full">
            <IconSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-300 pointer-events-none"
              stroke={1.75}
            />
            <input
              type="search"
              autoFocus
              aria-label="Mobile global search"
              placeholder="Search customers, invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  showComingSoon(`Search for "${searchQuery}" coming in Phase 2`);
                }
              }}
              className="w-full h-9 pl-9 pr-3 text-[14px] rounded-md bg-white/10 border border-white/15 text-white placeholder:text-slate-300 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
