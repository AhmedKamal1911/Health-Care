"use client";

import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";

import ScheduleAppointmentModal from "../../health-care/schedule-appointment-modal";

import { useMemo, useState } from "react";

import { HealthCareTable, TablePagination, TableManagerBox } from "..";
import { useCustomTable } from "../hooks/useCustomTable";
import { getPatientAppointmentsTableColumns } from "./columns";

export function PatientAppointmentsTable({
  documents,
  doctors,
}: {
  documents: Appointment[];
  doctors: Doctor[];
}) {
  console.log({ documents });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(
    () => getPatientAppointmentsTableColumns(doctors),
    [doctors]
  );

  const table = useCustomTable({
    columns,
    data: documents,
    initialState: { pagination: { pageSize: 7 } },
    columnFilters,
    columnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  // const table = useReactTable({
  //   data: documents,
  //   columns,

  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   initialState: {
  //     pagination: {
  //       pageSize: 7,
  //     },
  //   },
  //   state: {
  //     columnVisibility,
  //     columnFilters,
  //   },
  // });

  return (
    <div className="flex flex-1 flex-col h-full border rounded-xl px-6 py-4 border-[#1A1D21] bg-darkPrimary">
      <TableManagerBox table={table} />

      <div className="flex flex-col gap-2 ">
        <HealthCareTable table={table} />
        <div>
          <ScheduleAppointmentModal doctors={doctors} />
        </div>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
