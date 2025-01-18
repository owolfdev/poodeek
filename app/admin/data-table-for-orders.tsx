"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUpDown } from "lucide-react";
import { getOrders } from "./actions";
import Link from "next/link";

type Order = {
  id: string;
  created_at: string;
  grand_total: number;
  currency: string;
  status: string;
  customer_name: string;
};

export default function OrdersTable() {
  const [data, setData] = React.useState<Order[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        setData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const globalFilterFn: FilterFn<Order> = (row, columnIds, filterValue) => {
    const lowercasedFilter = filterValue.toLowerCase();
    return (
      row.original.id.toLowerCase().includes(lowercasedFilter) ||
      row.original.customer_name.toLowerCase().includes(lowercasedFilter)
    );
  };

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) => (
          <Link target="_blank" href={`/shop/orders-admin/${row.original.id}`}>
            <span>{row.original.id}</span>
          </Link>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => (
          <span>
            {new Date(row.original.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
        ),
      },
      {
        accessorKey: "customer_name",
        header: "Customer Name",
        cell: ({ row }) => <span>{row.original.customer_name}</span>,
        filterFn: "includesString",
      },
      {
        accessorKey: "grand_total",
        header: "Total",
        cell: ({ row }) => (
          <span>
            {row.original.currency} {row.original.grand_total.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="capitalize">{row.original.status}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: globalFilterFn,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [{ id: "created_at", desc: true }], // Default sorting by 'created_at'
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search orders..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <p className="text-xs mb-2">Click on Order ID to view order details.</p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Button
                        variant="ghost"
                        onClick={() => header.column.toggleSorting()}
                        className="flex items-center space-x-2"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div>
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
        <div>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
}
