"use client";

import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import HealthCareTable from "../common/health-care-table";
import TablePagination from "../common/table-pagination";

import { useCustomTable } from "../hooks/useCustomTable";
import { getAdminDoctorsTableColumns } from "./columns";
import { Doctor } from "@/lib/types/doctor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import Link from "next/link";

type Props = { documents: Doctor[] };
export default function DoctorTable({ documents }: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useMemo(() => getAdminDoctorsTableColumns(), []);
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
      <div className="flex max-lg:flex-col justify-between max-lg:gap-2 mb-4">
        <Input
          placeholder="Filter Doctors..."
          value={
            (table.getColumn("doctorName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("doctorName")?.setFilterValue(event.target.value);
          }}
          className="w-[300px] max-lg:w-full "
        />
        <Button asChild>
          <Link
            href={"/dashboard/doctors/create"}
            className="flex gap-2 items-center"
          >
            <span className="font-bold cursor-pointer">Add Doctor</span>
            <HeartPulse />
          </Link>
        </Button>
      </div>
      <HealthCareTable table={table} />

      <TablePagination table={table} />
    </div>
  );
}
