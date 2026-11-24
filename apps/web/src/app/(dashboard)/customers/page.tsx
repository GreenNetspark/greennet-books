"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  UserPlus,
  Upload,
  Download,
  Users,
  IndianRupee,
  ShieldAlert,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/shared/SummaryCard";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CustomerFilters } from "@/features/customers/components/CustomerFilters";
import { getCustomerColumns } from "@/features/customers/components/CustomerColumns";
import {
  getCustomers,
  toggleCustomerStatus,
  CustomersResponse,
} from "@/features/customers/api";
import { Customer } from "@/types/customer";
import { formatCurrency } from "@/lib/formatters";

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CustomersResponse["summary"]>({
    totalReceivables: 0,
    totalAdvances: 0,
    activeCount: 0,
    totalCount: 0,
  });
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
      setSummary(res.summary);
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
    } catch (err) {
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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Customers"
        description="Manage customers, GST details, outstanding receivables, and advance balances."
        breadcrumbs={[
          { label: "Sales", href: "/customers" },
          { label: "Customers", href: "/customers" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Customer bulk import will be available in Phase 2.")}
              className="gap-1.5 text-xs"
            >
              <Upload className="size-3.5 text-muted-foreground" />
              <span>Import</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Exporting customer master list to Excel/CSV...")}
              className="gap-1.5 text-xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export</span>
            </Button>
            <Button
              render={<Link href="/customers/new" />}
              size="sm"
              className="gap-1.5 text-xs bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90"
            >
              <UserPlus className="size-3.5" />
              <span>Create Customer</span>
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Customers"
          value={isLoading ? "..." : summary.totalCount}
          subtitle={`${summary.activeCount} active in system`}
          icon={Users}
          iconClassName="text-primary"
        />
        <SummaryCard
          title="Active Customers"
          value={isLoading ? "..." : summary.activeCount}
          subtitle="Ready for invoicing"
          icon={CheckCircle2}
          iconClassName="text-emerald-600"
        />
        <SummaryCard
          title="Total Receivables"
          value={isLoading ? "..." : formatCurrency(summary.totalReceivables)}
          subtitle="Outstanding customer balances"
          icon={IndianRupee}
          iconClassName="text-emerald-600"
        />
        <SummaryCard
          title="Customer Advances"
          value={isLoading ? "..." : formatCurrency(summary.totalAdvances)}
          subtitle="Unallocated advance liabilities"
          icon={Wallet}
          iconClassName="text-blue-600"
        />
      </div>

      {/* Filter Bar */}
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
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3">
            <ShieldAlert className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Permission Restricted
          </h3>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground">
            You do not have authorized permissions to view or manage customer accounts for this organization. Contact your administrator to request access.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-4 text-xs"
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
          pageSize={10}
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
                  className="gap-1.5 text-xs"
                >
                  <UserPlus className="size-3.5" />
                  Create Customer
                </Button>
              }
            />
          }
        />
      )}
    </div>
  );
}
