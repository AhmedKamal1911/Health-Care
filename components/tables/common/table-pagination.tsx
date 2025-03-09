import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
};
export default function TablePagination<T>({ table }: Props<T>) {
  return (
    <>
      <div className="my-4">
        <div className="flex justify-between">
          <Button
            variant="default"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="text-tertiary text-sm">
        Page ( {table.getPageCount()} ) <span className="font-normal">of</span>{" "}
        {table.getState().pagination.pageIndex + 1}
      </div>
    </>
  );
}
