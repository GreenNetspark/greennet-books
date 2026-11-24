"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Search,
  Bell,
  HelpCircle,
  Settings,
  User,
  ChevronDown,
  Check,
  LogOut,
  FileText,
  UserPlus,
  Receipt,
  CreditCard,
  Building,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { SidebarTrigger } from "@/components/ui/sidebar";

const ORGANIZATIONS = [
  { id: "org-1", name: "GreenNet Technologies", gstin: "29AAAAA0000A1Z5", type: "Headquarters" },
  { id: "org-2", name: "GreenNet Retail LLP", gstin: "27BBBBB1111B1Z2", type: "Subsidiary" },
  { id: "org-3", name: "GreenNet Global", gstin: "33CCCCC2222C1Z9", type: "Branch Entity" },
];

const BRANCHES = [
  { id: "br-all", name: "All Branches" },
  { id: "br-1", name: "Bengaluru (HQ)" },
  { id: "br-2", name: "Mumbai" },
  { id: "br-3", name: "Delhi NCR" },
];

export function Topbar() {
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOrgChange = (org: typeof ORGANIZATIONS[0]) => {
    setSelectedOrg(org);
    toast.success(`Switched to ${org.name}`);
  };

  const handleBranchChange = (branch: typeof BRANCHES[0]) => {
    setSelectedBranch(branch);
    toast.info(`Branch: ${branch.name}`);
  };

  return (
    <header className="sticky top-0 z-40 flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-card px-3 gap-3">

      {/* Left: Sidebar trigger + Org + Branch */}
      <div className="flex items-center gap-2 shrink-0">
        <SidebarTrigger
          aria-label="Toggle sidebar"
          className="text-muted-foreground hover:text-foreground transition-colors h-7 w-7"
        />

        {/* Org Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="Switch organization"
              className="hidden md:flex items-center gap-1.5 h-7 px-2 text-[13px] font-medium rounded hover:bg-muted/60 transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          }>
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span className="max-w-[160px] truncate">{selectedOrg.name}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-1">
            <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ORGANIZATIONS.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrgChange(org)}
                className="flex items-start justify-between p-2 cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[13px] text-foreground">{org.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {org.type} · {org.gstin}
                  </div>
                </div>
                {selectedOrg.id === org.id && (
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Branch chip */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="Select branch"
              className="hidden lg:flex items-center gap-1 h-6 px-2 text-[12px] rounded-full bg-muted/70 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          }>
            <MapPin className="size-3 shrink-0" />
            <span className="max-w-[100px] truncate">{selectedBranch.name}</span>
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 p-1">
            <DropdownMenuLabel>Select Branch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {BRANCHES.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => handleBranchChange(branch)}
                className="flex items-center justify-between text-[13px] cursor-pointer"
              >
                <span>{branch.name}</span>
                {selectedBranch.id === branch.id && (
                  <Check className="size-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-sm hidden md:flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            aria-label="Global search"
            placeholder="Search... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                toast.info(`Search for "${searchQuery}" coming in Phase 2`);
              }
            }}
            className="w-full h-7 pl-8 pr-3 text-[13px] rounded bg-muted/60 border border-border hover:border-primary/40 focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right: Notifications, Help, Settings, Profile */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="View notifications"
              className="relative flex items-center justify-center size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            />
          }>
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 size-1.5 bg-destructive rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[13px] font-semibold text-foreground">Notifications</span>
              <Badge variant="secondary" className="text-[11px] h-5">3 New</Badge>
            </div>
            <div className="divide-y divide-border text-[13px] max-h-64 overflow-y-auto">
              {[
                { title: "GST filing due in 4 days", sub: "GSTR-3B for October requires validation", time: "1 hour ago" },
                { title: "Customer advance allocated", sub: "₹25,000 allocated for Sri Lakshmi Traders", time: "3 hours ago" },
                { title: "Bank feed synced", sub: "HDFC Bank: 42 transactions imported", time: "Yesterday" },
              ].map((n, i) => (
                <div key={i} className="p-3 hover:bg-muted/40 cursor-pointer transition-colors">
                  <p className="font-medium text-foreground leading-tight">{n.title}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{n.sub}</p>
                  <span className="text-[11px] text-muted-foreground/70 mt-1 block">{n.time}</span>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border text-center">
              <button
                type="button"
                onClick={() => toast.info("Notification centre coming soon")}
                className="text-[12px] text-primary font-medium hover:underline cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="Help and support"
              className="flex items-center justify-center size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            />
          }>
            <HelpCircle className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1 text-[13px]">
            <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Opening Documentation")} className="cursor-pointer">
              Documentation & Guides
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening GST Guide")} className="cursor-pointer">
              Indian GST Compliance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening Support")} className="cursor-pointer">
              Contact CA Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          onClick={() => toast.info("Settings coming soon")}
          className="flex items-center justify-center size-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Settings className="size-4" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-1" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="User profile menu"
              className="flex items-center gap-1.5 focus:outline-none cursor-pointer hover:bg-muted/60 rounded px-1.5 h-7 transition-colors"
            />
          }>
            <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[11px]">
              PB
            </div>
            <div className="hidden xl:flex flex-col text-left leading-none">
              <span className="text-[13px] font-medium text-foreground">Pavan Bhat</span>
            </div>
            <ChevronDown className="size-3 text-muted-foreground hidden xl:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 text-[13px]">
            <div className="p-2.5 border-b border-border">
              <p className="font-semibold text-foreground">Pavan Bhat</p>
              <p className="text-[11px] text-muted-foreground">shreekrishnabhat.km@gmail.com</p>
              <div className="mt-1.5">
                <Badge variant="outline" className="text-[11px] text-primary border-primary/30 bg-primary/5">
                  <ShieldCheck className="size-3 mr-1" /> Organization Owner
                </Badge>
              </div>
            </div>
            <DropdownMenuGroup className="py-1">
              <DropdownMenuItem onClick={() => toast.info("Profile settings coming soon")} className="cursor-pointer">
                <User className="size-3.5 mr-2 text-muted-foreground" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Organization settings coming soon")} className="cursor-pointer">
                <Building className="size-3.5 mr-2 text-muted-foreground" />
                <span>Organization Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Preferences coming soon")} className="cursor-pointer">
                <Settings className="size-3.5 mr-2 text-muted-foreground" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success("Sign out simulated")}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="size-3.5 mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
