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
import { RotateCcw, SlidersHorizontal } from "lucide-react";
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
    <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-border bg-card px-3 py-2">
      {/* Left: Search + Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search name, GSTIN, phone..."
            className="w-full h-8 text-[12px]"
          />
        </div>

        {/* Status Filter */}
        <div className="w-[120px]">
          <Select value={statusFilter} onValueChange={(val) => onStatusChange(val || "all")}>
            <SelectTrigger className="h-8 text-[12px] rounded">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="w-[125px]">
          <Select value={typeFilter} onValueChange={(val) => onTypeChange(val || "all")}>
            <SelectTrigger className="h-8 text-[12px] rounded">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Balance Only */}
        <div className="flex items-center gap-1.5 pl-1">
          <Checkbox
            id="hasBalance"
            checked={hasBalanceOnly}
            onCheckedChange={(checked) => onHasBalanceChange(Boolean(checked))}
          />
          <Label htmlFor="hasBalance" className="text-[12px] cursor-pointer font-normal text-muted-foreground">
            With balance
          </Label>
        </div>
      </div>

      {/* Right: QA State Simulator & Reset */}
      <div className="flex items-center gap-2">
        <div className="w-[140px]">
          <Select
            value={stateOverride}
            onValueChange={(val: any) => onStateOverrideChange(val || "normal")}
          >
            <SelectTrigger className="h-8 text-[12px] border-dashed text-muted-foreground rounded">
              <SlidersHorizontal className="size-3 mr-1" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">State: Normal</SelectItem>
              <SelectItem value="empty">State: Empty</SelectItem>
              <SelectItem value="error">State: Error</SelectItem>
              <SelectItem value="permission_denied">State: Forbidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-[12px] gap-1 text-muted-foreground hover:text-foreground rounded px-2"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
