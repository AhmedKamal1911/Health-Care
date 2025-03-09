import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { HeartOff } from "lucide-react";

type Props<T> = {
  table: TableType<T>;
};
export default function HealthCareTable<T>({ table }: Props<T>) {
  return (
    <Table className="border border-[#1A1D21] ">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="bg-darkPrimary" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead className="p-3" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="bg-primary even:bg-[#1C2023]"
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="text-center">
            <TableCell
              colSpan={table.getAllColumns().length}
              className="mx-auto text-xl"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <span>No Results.</span>
                <HeartOff className="size-7 md:size-10" />
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
