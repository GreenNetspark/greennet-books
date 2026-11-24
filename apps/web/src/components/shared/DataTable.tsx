"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  pageSize = 20,
  emptyState,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow =
    totalRows === 0
      ? 0
      : table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize +
        1;
  const endRow = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    totalRows
  );

  return (
    <div className="space-y-2">
      {/* Compact Zoho-style Table Container */}
      <div className="rounded border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#f8f9fa] dark:bg-muted/40 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap h-10 px-3.5 py-2"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 hover:text-foreground transition-colors group cursor-pointer select-none uppercase"
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            <span className="text-muted-foreground group-hover:text-foreground">
                              {isSorted === "asc" ? (
                                <ArrowUp className="size-3 text-primary stroke-[2.5]" />
                              ) : isSorted === "desc" ? (
                                <ArrowDown className="size-3 text-primary stroke-[2.5]" />
                              ) : (
                                <ArrowUpDown className="size-3 opacity-35 group-hover:opacity-100 transition-opacity" />
                              )}
                            </span>
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent border-b border-border/60 h-9">
                    {columns.map((_, colIdx) => (
                      <TableCell key={colIdx} className="px-3 py-1.5">
                        <Skeleton className="h-3.5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={`h-11 transition-colors border-b border-border/60 last:border-b-0 even:bg-[#fbfbfb] dark:even:bg-muted/15 hover:bg-blue-50/50 dark:hover:bg-accent/40 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3.5 py-2 text-[13.5px] text-foreground align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-left p-4"
                  >
                    {emptyState || (
                      <EmptyState
                        title="No records found"
                        description="Try adjusting your search or filters to find what you are looking for."
                      />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Inline Zoho-style Pagination Footer */}
      {!isLoading && totalRows > 0 && (
        <div className="flex items-center justify-between px-1 py-1 text-[12px] text-muted-foreground">
          <div className="tabular-nums">
            <span className="font-medium text-foreground">
              {startRow}–{endRow}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalRows}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                title="Previous page"
                className="h-7 w-7 rounded"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                title="Next page"
                className="h-7 w-7 rounded"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
            <span className="text-[12px] text-muted-foreground hidden sm:inline">
              {table.getState().pagination.pageSize} per page
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
