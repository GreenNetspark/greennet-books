"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Search,
  Plus,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  Check,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  FileText,
  UserPlus,
  Receipt,
  CreditCard,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ORGANIZATIONS = [
  { id: "org-1", name: "GreenNet Technologies Pvt Ltd", gstin: "29AAAAA0000A1Z5", type: "Headquarters" },
  { id: "org-2", name: "GreenNet Retail LLP", gstin: "27BBBBB1111B1Z2", type: "Subsidiary" },
  { id: "org-3", name: "GreenNet Global Solutions", gstin: "33CCCCC2222C1Z9", type: "Branch Entity" },
];

const BRANCHES = [
  { id: "br-all", name: "All Branches" },
  { id: "br-1", name: "Bengaluru Central (HQ)" },
  { id: "br-2", name: "Mumbai West Hub" },
  { id: "br-3", name: "Delhi NCR Office" },
];

export function Topbar() {
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOrgChange = (org: typeof ORGANIZATIONS[0]) => {
    setSelectedOrg(org);
    toast.success(`Switched organization to ${org.name}`);
  };

  const handleBranchChange = (branch: typeof BRANCHES[0]) => {
    setSelectedBranch(branch);
    toast.info(`Switched branch context to ${branch.name}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Global search for "${searchQuery}" is coming in Phase 2`);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Left side: Sidebar Toggle & Org / Branch Selectors */}
      <div className="flex items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle sidebar"
          className="text-muted-foreground hover:text-foreground transition-colors"
        />

        <div className="hidden lg:flex items-center gap-2">
          {/* 1. Organization Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button
                type="button"
                aria-label="Switch organization"
                className="flex items-center gap-2 h-9 px-3 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted/60 transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }>
              <Building2 className="size-3.5 text-primary" />
              <div className="flex flex-col text-left">
                <span className="font-semibold truncate max-w-[170px] leading-tight">
                  {selectedOrg.name}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  GST: {selectedOrg.gstin}
                </span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-1">
              <DropdownMenuLabel>
                Switch Organization
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ORGANIZATIONS.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgChange(org)}
                  className="flex items-start justify-between p-2 cursor-pointer"
                >
                  <div>
                    <div className="font-medium text-xs text-foreground">{org.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {org.type} • {org.gstin}
                    </div>
                  </div>
                  {selectedOrg.id === org.id && (
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2. Branch Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button
                type="button"
                aria-label="Select branch"
                className="flex items-center gap-1.5 h-9 px-2.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted/60 transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }>
              <MapPin className="size-3.5 text-muted-foreground" />
              <span className="truncate max-w-[120px]">{selectedBranch.name}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1">
              <DropdownMenuLabel>
                Select Branch
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {BRANCHES.map((branch) => (
                <DropdownMenuItem
                  key={branch.id}
                  onClick={() => handleBranchChange(branch)}
                  className="flex items-center justify-between text-xs cursor-pointer"
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
      </div>

      {/* Middle: 3. Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Global search"
            placeholder="Search customers, invoices, transactions... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-12 h-9 text-xs bg-muted/30 border-border focus-visible:bg-background transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right side: 4. Quick Create, 5. Notifications, 6. Help, 7. Profile */}
      <div className="flex items-center gap-2">
        {/* 4. Quick Create */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              size="sm"
              aria-label="Quick create transaction"
              className="h-9 gap-1.5 text-xs font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
            />
          }>
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Quick Create</span>
            <ChevronDown className="size-3 ml-0.5 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuLabel>
              New Transaction / Entity
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/customers/new" className="flex items-center gap-2 text-xs py-2 cursor-pointer font-medium text-primary" />}>
              <UserPlus className="size-3.5" />
              <span>Create Customer</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info("Sales Invoice creation coming in next phase")}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer"
            >
              <FileText className="size-3.5 text-muted-foreground" />
              <span>Sales Invoice</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info("Vendor Bill creation coming in next phase")}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer"
            >
              <Receipt className="size-3.5 text-muted-foreground" />
              <span>Vendor Bill</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info("Payment recording coming in next phase")}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer"
            >
              <CreditCard className="size-3.5 text-muted-foreground" />
              <span>Record Payment</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 5. Notifications */}
        <Popover>
          <PopoverTrigger render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="View notifications"
              className="relative size-9 text-muted-foreground hover:text-foreground"
            />
          }>
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              <Badge variant="secondary" className="text-[10px]">3 New</Badge>
            </div>
            <div className="divide-y divide-border text-xs max-h-72 overflow-y-auto">
              <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">GST filing due in 4 days</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">GSTR-3B for October period requires validation</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">1 hour ago</span>
              </div>
              <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Customer advance allocated</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">₹25,000 allocated for Sri Lakshmi Traders</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">3 hours ago</span>
              </div>
              <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Bank feed synced</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">HDFC Bank statement imported 42 transactions</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">Yesterday</span>
              </div>
            </div>
            <div className="p-2 border-t border-border text-center">
              <button
                type="button"
                onClick={() => toast.info("Notification center coming soon")}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* 6. Help Icon */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Help and support resources"
              className="size-9 text-muted-foreground hover:text-foreground"
            />
          }>
            <HelpCircle className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 text-xs">
            <DropdownMenuLabel>
              GreenNet Books Help
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Opening Documentation")} className="cursor-pointer">
              Documentation & Guides
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening GST Masterclass")} className="cursor-pointer">
              Indian GST Compliance Guide
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening Support Ticket dialog")} className="cursor-pointer">
              Contact CA Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
              GreenNet Books v1.0.0 (SaaS Edition)
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 7. User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button
              type="button"
              aria-label="User profile menu"
              className="flex items-center gap-2 pl-2 focus:outline-none cursor-pointer"
            />
          }>
            <div className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
              PB
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground leading-tight">
                Pavan Bhat
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Finance Admin
              </span>
            </div>
            <ChevronDown className="size-3 text-muted-foreground hidden xl:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 text-xs">
            <div className="p-2 border-b border-border">
              <p className="font-semibold text-foreground">Pavan Bhat</p>
              <p className="text-[11px] text-muted-foreground">shreekrishnabhat.km@gmail.com</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5">
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
              <DropdownMenuItem onClick={() => toast.info("Preferences dialog coming soon")} className="cursor-pointer">
                <SettingsIcon className="size-3.5 mr-2 text-muted-foreground" />
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
