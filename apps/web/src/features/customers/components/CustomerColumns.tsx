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

        return (
          <div className="flex flex-col min-w-[190px] py-0.5">
            <button
              type="button"
              onClick={() =>
                toast.info(
                  `Customer Details (UI-CUST-003) for ${customer.name} will be released in Phase 2.`,
                  { id: "coming-soon" }
                )
              }
              className="font-medium text-[13px] text-primary hover:underline text-left truncate max-w-[230px] cursor-pointer leading-tight"
            >
              {customer.name}
            </button>
            <span className="text-[11px] text-muted-foreground truncate max-w-[230px] leading-tight mt-0.5">
              {customer.contactPerson}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span className="text-[12px] text-muted-foreground capitalize">
            {type === "business" ? "Business" : "Individual"}
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
          return <span className="text-muted-foreground text-[12px] font-mono">—</span>;
        }

        return (
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[12px] text-foreground">
              {gstin}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {placeOfSupply}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "mobile",
      header: "Phone / Email",
      cell: ({ row }) => {
        const mobile = row.getValue("mobile") as string;
        const email = row.original.email;
        return (
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[12px] text-foreground">
              {formatPhoneNumber(mobile)}
            </span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[160px]">
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
          <div
            className={`text-right tabular-nums text-[13px] ${
              amount > 0 ? "money" : "text-muted-foreground"
            }`}
          >
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "advanceBalance",
      header: () => <div className="text-right">Unused Credits</div>,
      cell: ({ row }) => {
        const amount = row.getValue("advanceBalance") as number;
        if (amount > 0) {
          return (
            <div className="text-right tabular-nums text-[13px] money">
              {formatCurrency(amount)}
            </div>
          );
        }
        return (
          <div className="text-right tabular-nums text-[13px] text-muted-foreground">
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
                  size="icon-xs"
                  aria-label={`Actions for ${customer.name}`}
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                />
              }>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1 text-[12px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(
                      `View Details (UI-CUST-003) for ${customer.name} coming in Phase 2.`,
                      { id: "coming-soon" }
                    )
                  }
                  className="cursor-pointer"
                >
                  <Eye className="size-3.5 mr-2 text-muted-foreground" />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(`Edit form for ${customer.name} coming in Phase 2.`, {
                      id: "coming-soon",
                    })
                  }
                  className="cursor-pointer"
                >
                  <Edit className="size-3.5 mr-2 text-muted-foreground" />
                  <span>Edit Customer</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info(`Creating invoice for ${customer.name}...`, {
                      id: "coming-soon",
                    })
                  }
                  className="cursor-pointer"
                >
                  <FileText className="size-3.5 mr-2 text-muted-foreground" />
                  <span>New Invoice</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onToggleStatus(customer)}
                  className={`cursor-pointer font-medium ${
                    isInactive ? "text-success" : "text-warning"
                  }`}
                >
                  <Power className="size-3.5 mr-2" />
                  <span>{isInactive ? "Mark as Active" : "Mark as Inactive"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
