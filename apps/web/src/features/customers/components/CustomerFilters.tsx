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

const STATUS_LABELS: Record<string, string> = {
  all: "All Status",
  active: "Active",
  inactive: "Inactive",
};

const TYPE_LABELS: Record<string, string> = {
  all: "All Types",
  business: "Business",
  individual: "Individual",
};

const STATE_LABELS: Record<string, string> = {
  normal: "State: Normal",
  empty: "State: Empty",
  error: "State: Error",
  permission_denied: "State: Forbidden",
};

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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 rounded border border-border bg-card px-3 py-2.5">
      {/* Left: Search + Dropdowns */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 flex-1 min-w-0">
        <div className="w-full sm:w-64">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search name, GSTIN, phone..."
            className="w-full h-9 text-[13px]"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* Status Filter */}
          <div className="w-full sm:w-[130px]">
            <Select value={statusFilter} onValueChange={(val) => onStatusChange(val || "all")}>
              <SelectTrigger size="sm" className="h-9 text-[13px] rounded">
                <SelectValue placeholder="Status">
                  {STATUS_LABELS[statusFilter] ?? "All Status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-[135px]">
            <Select value={typeFilter} onValueChange={(val) => onTypeChange(val || "all")}>
              <SelectTrigger size="sm" className="h-9 text-[13px] rounded">
                <SelectValue placeholder="Type">
                  {TYPE_LABELS[typeFilter] ?? "All Types"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Balance Only */}
        <div className="flex items-center gap-2 sm:pl-1">
          <Checkbox
            id="hasBalance"
            checked={hasBalanceOnly}
            onCheckedChange={(checked) => onHasBalanceChange(Boolean(checked))}
          />
          <Label htmlFor="hasBalance" className="text-[13px] cursor-pointer font-normal text-muted-foreground">
            With balance
          </Label>
        </div>
      </div>

      {/* Right: QA State Simulator & Reset */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
        <div className="w-full sm:w-[155px]">
          <Select
            value={stateOverride}
            onValueChange={(val: any) => onStateOverrideChange(val || "normal")}
          >
            <SelectTrigger size="sm" className="h-9 text-[13px] border-dashed text-muted-foreground rounded">
              <SlidersHorizontal className="size-3.5 mr-1 shrink-0" />
              <SelectValue placeholder="State">
                {STATE_LABELS[stateOverride] ?? "State: Normal"}
              </SelectValue>
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
            className="h-8 text-[12px] gap-1 text-muted-foreground hover:text-foreground rounded px-2 shrink-0"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
