"use client";

import * as React from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
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
import Link from "next/link"; // Import Link component

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

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const orders = await getOrders();
        setData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",

        cell: ({ row }: { row: { original: Order } }) => (
          <Link target="_blank" href={`/shop/orders-admin/${row.original.id}`}>
            <span>{row.original.id}</span>
          </Link>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }: { row: { original: Order } }) => (
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
        cell: ({ row }: { row: { original: Order } }) => (
          <span>{row.original.customer_name}</span>
        ),
      },
      {
        accessorKey: "grand_total",
        header: "Total",
        cell: ({ row }: { row: { original: Order } }) => (
          <span>
            {row.original.currency} {row.original.grand_total.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: Order } }) => (
          <span className="capitalize">{row.original.status}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return typeof value === "string"
        ? value.toLowerCase().includes(filterValue.toLowerCase())
        : false;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <p className="text-xs mb-2">Click on Order ID to open order in Shopify</p>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
