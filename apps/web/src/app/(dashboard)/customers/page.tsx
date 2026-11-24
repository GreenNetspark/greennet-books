"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Upload,
  Download,
  Users,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CustomerFilters } from "@/features/customers/components/CustomerFilters";
import { getCustomerColumns } from "@/features/customers/components/CustomerColumns";
import {
  getCustomers,
  toggleCustomerStatus,
} from "@/features/customers/api";
import { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [hasBalanceOnly, setHasBalanceOnly] = useState(false);
  const [stateOverride, setStateOverride] = useState<
    "normal" | "empty" | "error" | "permission_denied"
  >("normal");

  // Fetch Customers Data
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsPermissionDenied(false);

    try {
      const res = await getCustomers({
        query: searchQuery,
        status: statusFilter,
        type: typeFilter,
        hasBalance: hasBalanceOnly,
        stateOverride,
      });

      setData(res.data);
    } catch (err: any) {
      if (err.message && err.message.includes("PERMISSION_DENIED")) {
        setIsPermissionDenied(true);
      } else {
        setError(err.message || "Failed to load customers");
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, typeFilter, hasBalanceOnly, stateOverride]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Handle Toggle Active/Inactive status
  const handleToggleStatus = async (customer: Customer) => {
    try {
      const updated = await toggleCustomerStatus(customer.id);
      setData((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, status: updated.status } : c))
      );
      toast.success(
        `Customer "${customer.name}" marked as ${
          updated.status === "active" ? "Active" : "Inactive"
        }.`
      );
    } catch {
      toast.error("Failed to update customer status.");
    }
  };

  const columns = useMemo(
    () =>
      getCustomerColumns({
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setHasBalanceOnly(false);
    setStateOverride("normal");
  };

  return (
    <div className="space-y-3">
      {/* Zoho-style Single-Row Page Header */}
      <PageHeader
        title="Customers"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Customer bulk import will be available in Phase 2.")}
              className="h-8 gap-1.5 text-[12px] rounded"
            >
              <Upload className="size-3.5 text-muted-foreground" />
              <span>Import</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Exporting customer master list to Excel/CSV...")}
              className="h-8 gap-1.5 text-[12px] rounded"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export</span>
            </Button>
            <Button
              render={<Link href="/customers/new" />}
              size="sm"
              className="h-8 gap-1 text-[12px] bg-primary text-primary-foreground font-medium hover:bg-primary/90 rounded px-3"
            >
              <Plus className="size-3.5" />
              <span>New</span>
            </Button>
          </div>
        }
      />

      {/* Compact Filter Bar */}
      <CustomerFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        hasBalanceOnly={hasBalanceOnly}
        onHasBalanceChange={setHasBalanceOnly}
        stateOverride={stateOverride}
        onStateOverrideChange={setStateOverride}
        onReset={handleResetFilters}
      />

      {/* Main Content: Table or Special State */}
      {isPermissionDenied ? (
        <div className="flex flex-col items-start rounded border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 text-destructive mb-1.5">
            <ShieldAlert className="size-5" />
            <h3 className="text-[14px] font-semibold">
              Permission Restricted
            </h3>
          </div>
          <p className="max-w-lg text-[13px] text-muted-foreground">
            You do not have authorized permissions to view or manage customer accounts for this organization. Contact your administrator to request access.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-3 h-8 text-[12px] rounded"
          >
            Reset Simulator State
          </Button>
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load customers"
          message={error}
          onRetry={loadCustomers}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          pageSize={20}
          emptyState={
            <EmptyState
              icon={Users}
              title="No customers found"
              description={
                searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "No customers matched your filter criteria. Try clearing some filters."
                  : "You haven't added any customers yet. Create your first customer to start invoicing."
              }
              action={
                <Button
                  render={<Link href="/customers/new" />}
                  size="sm"
                  className="h-8 gap-1 text-[12px] rounded"
                >
                  <Plus className="size-3.5" />
                  New Customer
                </Button>
              }
            />
          }
        />
      )}
    </div>
  );
}
