import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  Table,
  InitialTableState,
  OnChangeFn,
} from "@tanstack/react-table";

type UseCustomTableProps<T> = {
  columns: ColumnDef<T>[]; // Table column definitions
  data: T[]; // Table data
  initialState?: InitialTableState; // Initial state for the table
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState> | undefined; // Handler for column filter changes
  onColumnVisibilityChange?: OnChangeFn<VisibilityState> | undefined; // Handler for visibility changes
  columnVisibility?: VisibilityState; // Current column visibility state
  columnFilters?: ColumnFiltersState; // Current column filter state
};

export function useCustomTable<T>({
  columns,
  data,
  initialState,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  columnVisibility,
  columnFilters,
}: UseCustomTableProps<T>): Table<T> {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<T>(), // Core row model for basic table rows
    getPaginationRowModel: getPaginationRowModel<T>(), // Pagination handling
    getFilteredRowModel: getFilteredRowModel<T>(), // Filtering handling
    initialState, // Initial table state
    state: {
      columnVisibility, // Visibility state
      columnFilters, // Filters state
    },
    onColumnFiltersChange, // Handle column filter changes
    onColumnVisibilityChange, // Handle visibility changes
  });

  return table;
}
