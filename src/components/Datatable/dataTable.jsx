import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./dataTablePagination";
import { useEffect, useState } from "react";
import DataTableToolbar from "./dataTableToolbar";
import moment from "moment";

export function DataTable({ columns, data, source }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(()=> {
    //this useEffect is to set the filter of the calender to be today's date. 
    if(source === "doctorsUnavailability" || source === "appointments"){
      table.getColumn("date")?.setFilterValue(moment().format())
    }
  }, [table, source]);

  return (
    <div className="flex flex-col gap-y-6 bg-card p-4 rounded-xl">
      <DataTableToolbar table={table} source={source} />
      <div className="rounded-md border flex-1 bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
