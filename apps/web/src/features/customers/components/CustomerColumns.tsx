"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatPhoneNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Power,
  FileText,
  Building,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface GetColumnsOptions {
  onToggleStatus: (customer: Customer) => void;
}

export function getCustomerColumns({
  onToggleStatus,
}: GetColumnsOptions): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => {
        const customer = row.original;
        const isBusiness = customer.type === "business";

        return (
          <div className="flex items-center gap-2.5 min-w-[210px]">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              {isBusiness ? (
                <Building className="size-4" />
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    `Customer Details (UI-CUST-003) for ${customer.name} will be released in Phase 2.`
                  )
                }
                className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors text-left truncate max-w-[220px] cursor-pointer"
              >
                {customer.name}
              </button>
              <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                {customer.contactPerson}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Customer Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const isBusiness = type === "business";
        return (
          <span className="inline-flex items-center text-xs font-medium text-muted-foreground capitalize">
            {isBusiness ? "Business" : "Individual"}
          </span>
        );
      },
    },
    {
      accessorKey: "gstin",
      header: "GSTIN",
      cell: ({ row }) => {
        const gstin = row.getValue("gstin") as string | undefined;
        const placeOfSupply = row.original.placeOfSupply;

        if (!gstin) {
          return <span className="text-muted-foreground text-xs font-mono">—</span>;
        }

        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-medium text-foreground tracking-tight">
              {gstin}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {placeOfSupply}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => {
        const mobile = row.getValue("mobile") as string;
        const email = row.original.email;
        return (
          <div className="flex flex-col">
            <span className="font-mono text-xs text-foreground">
              {formatPhoneNumber(mobile)}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
              {email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "receivables",
      header: () => <div className="text-right">Receivables</div>,
      cell: ({ row }) => {
        const amount = row.getValue("receivables") as number;
        return (
          <div className="text-right font-medium tabular-nums text-xs sm:text-sm text-foreground">
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "advanceBalance",
      header: () => <div className="text-right">Advance Balance</div>,
      cell: ({ row }) => {
        const amount = row.getValue("advanceBalance") as number;
        if (amount > 0) {
          return (
            <div className="text-right font-medium tabular-nums text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                {formatCurrency(amount)}
              </span>
            </div>
          );
        }
        return (
          <div className="text-right font-medium tabular-nums text-xs sm:text-sm text-muted-foreground">
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const customer = row.original;
        const isInactive = customer.status === "inactive";

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${customer.name}`}
                  className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                />
              }>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1 text-xs">
                <DropdownMenuLabel>
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(
                      `View Details (UI-CUST-003) for ${customer.name} coming in Phase 2.`
                    )
                  }
                  className="cursor-pointer"
                >
                  <Eye className="size-3.5 mr-2 text-muted-foreground" />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(`Edit form for ${customer.name} coming in Phase 2.`)
                  }
                  className="cursor-pointer"
                >
                  <Edit className="size-3.5 mr-2 text-muted-foreground" />
                  <span>Edit Customer</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(`Creating invoice for ${customer.name}...`)
                  }
                  className="cursor-pointer"
                >
                  <FileText className="size-3.5 mr-2 text-muted-foreground" />
                  <span>New Invoice</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggleStatus(customer)}
                  className={`cursor-pointer ${
                    isInactive ? "text-emerald-700 font-medium" : "text-amber-700 font-medium"
                  }`}
                >
                  <Power className="size-3.5 mr-2" />
                  <span>{isInactive ? "Activate Customer" : "Deactivate Customer"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
