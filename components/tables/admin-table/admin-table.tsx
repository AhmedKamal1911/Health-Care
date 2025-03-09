"use client";

import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import { Appointment } from "@/lib/types/appointment";

import { useMemo, useState } from "react";

import TableManagerBox from "../common/table-manager-box";
import HealthCareTable from "../common/health-care-table";
import TablePagination from "../common/table-pagination";
import { getAdminAppointmentsTableColumns } from "./columns";
import { useCustomTable } from "../hooks/useCustomTable";

type Props = { documents: Appointment[] };
export default function AdminTable({ documents }: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useMemo(() => getAdminAppointmentsTableColumns(), []);
  const table = useCustomTable({
    data: documents,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
    columnFilters,
    columnVisibility,
  });

  return (
    <div className="flex flex-1 flex-col h-full border rounded-xl px-6 py-4 border-[#1A1D21] bg-darkPrimary">
      <TableManagerBox table={table} />

      <HealthCareTable table={table} />

      <TablePagination table={table} />
    </div>
  );
}
