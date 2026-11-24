"use client";

import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, Filter, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CustomerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  hasBalanceOnly: boolean;
  onHasBalanceChange: (value: boolean) => void;
  stateOverride: "normal" | "empty" | "error" | "permission_denied";
  onStateOverrideChange: (
    value: "normal" | "empty" | "error" | "permission_denied"
  ) => void;
  onReset: () => void;
}

export function CustomerFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  hasBalanceOnly,
  onHasBalanceChange,
  stateOverride,
  onStateOverrideChange,
  onReset,
}: CustomerFiltersProps) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    hasBalanceOnly ||
    stateOverride !== "normal";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by customer name, GSTIN, mobile, or email..."
            className="w-full"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="w-[130px]">
            <Select value={statusFilter} onValueChange={(val) => onStatusChange(val || "all")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-[140px]">
            <Select value={typeFilter} onValueChange={(val) => onTypeChange(val || "all")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* QA / Testing State Simulator */}
          <div className="w-[150px]">
            <Select
              value={stateOverride}
              onValueChange={(val: any) => onStateOverrideChange(val || "normal")}
            >
              <SelectTrigger className="h-9 text-xs border-dashed text-muted-foreground">
                <SlidersHorizontal className="size-3 mr-1" />
                <SelectValue placeholder="Simulate State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">State: Normal</SelectItem>
                <SelectItem value="empty">State: Empty</SelectItem>
                <SelectItem value="error">State: Error</SelectItem>
                <SelectItem value="permission_denied">State: Forbidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Secondary filter bar: Checkbox for Balance only */}
      <div className="flex items-center gap-4 pt-1 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Checkbox
            id="hasBalance"
            checked={hasBalanceOnly}
            onCheckedChange={(checked) => onHasBalanceChange(Boolean(checked))}
          />
          <Label htmlFor="hasBalance" className="text-xs cursor-pointer font-normal">
            Show only customers with outstanding receivables or advance balance
          </Label>
        </div>
      </div>
    </div>
  );
}
