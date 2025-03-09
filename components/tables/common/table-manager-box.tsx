import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

type Props<T> = {
  table: Table<T>;
};
export default function TableManagerBox<T>({ table }: Props<T>) {
  return (
    <div className="flex max-md:flex-col gap-5 max-md:justify-center justify-between items-center py-4">
      <Input
        placeholder="Filter emails..."
        value={(table.getColumn("doctor")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("doctor")?.setFilterValue(event.target.value);
        }}
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="max-md:w-full">
          <Button variant="default">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-darkPrimary border-tertiary "
          align="end"
        >
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize "
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
