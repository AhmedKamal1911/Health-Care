"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, HeartOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";
import { Models } from "node-appwrite";
import { format } from "date-fns";
import DoctorBadge from "./doctor-badge";
import { Badge } from "../ui/badge";
import clsx from "clsx";

import CancelAppointmentModal from "./cancel-appointment-modal";
import ScheduleAppointmentModal from "./schedule-appointment-modal";

import { useState } from "react";
import { APPOINTMENT_STATUS_TUPLE, appointmentStatus } from "@/lib/data";
import { AppointmentStatus } from "@/lib/types/types";
import UpdateAppointmentModal from "./update-appointment-modal";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../ui/select";

export function PatientAppointmentsTable({
  documents,
  doctors,
}: {
  documents: Models.Document[];
  doctors: Doctor[];
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "doctor",
      enableHiding: false,
      header: () => <div className="text-left">Doctor</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-left font-medium">
            <DoctorBadge doctorName={getValue<Doctor>()?.doctorName} />
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const doctor = row.getValue<Doctor>(columnId);

        return doctor?.doctorName
          ?.toLowerCase()
          .includes(value.toLowerCase() ?? "");
      },
    },

    {
      accessorKey: "appointmentDate",
      header: ({ column }) => {
        return <div className="text-left">Date</div>;
      },
      cell: ({ getValue }) => (
        <div className="capitalize text-nowrap ">
          {format(getValue<string>(), " d, MMM yyyy - hh:mm a")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      filterFn: (row, columnId, value) => {
        if (value === "all") return true; // Allow all rows
        const status = row.getValue<AppointmentStatus>(columnId);
        return status === value; // Only match the selected status
      },

      // onChange={(event) => {
      //   table.getColumn("doctor")?.setFilterValue(event.target.value);
      // }}
      header: ({ table }) => {
        return (
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value: AppointmentStatus) => {
              console.log("changed", value);
              table.getColumn("status")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="flex gap-1">
              <span>Status</span>
              {/* <Filter className="size-5" /> */}
            </SelectTrigger>
            <SelectContent className="bg-darkPrimary">
              <SelectGroup>
                <SelectItem
                  onSelect={() => {
                    table.getColumn("status")?.setFilterValue("all"); // Clear the filter
                  }}
                  className="flex capitalize"
                  value={"all"}
                >
                  All
                </SelectItem>
                {APPOINTMENT_STATUS_TUPLE.map((stat, i) => (
                  <SelectItem
                    onSelect={() =>
                      table.getColumn("status")?.setFilterValue(stat)
                    }
                    className="flex capitalize"
                    key={i}
                    value={stat}
                  >
                    {stat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
      cell: ({ getValue }) => (
        <div className="capitalize">
          <Badge
            className={clsx(
              {
                "text-[#24AE7C] bg-[#0D2A1F]": getValue() === "scheduled",
                "text-[#79B5EC] bg-[#152432]": getValue() === "pending",
                "text-[#F37877] bg-[#3E1716]": getValue() === "cancelled",
              },
              "px-2 gap-2"
            )}
          >
            {appointmentStatus[getValue<AppointmentStatus>()]}
            {getValue<AppointmentStatus>()}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        console.log({ row });
        return (
          <div
            className={`${
              row.original.status === "pending" ? "flex items-center gap-2" : ""
            }`}
          >
            {row.original.status === "pending" && (
              <UpdateAppointmentModal
                doctors={doctors}
                appointment={row.original}
              />
            )}
            <CancelAppointmentModal
              appointmentStatus={row.original.status}
              appointmentId={row.original.$id}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: documents as Appointment[],
    columns,

    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-1 flex-col h-full border rounded-xl px-6 py-4 border-[#1A1D21] bg-darkPrimary">
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2 ">
        <Table className="border border-[#1A1D21] ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-darkPrimary" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="p-4" key={header.id}>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
        <div>
          <ScheduleAppointmentModal doctors={doctors} />
        </div>
      </div>

      <div className="space-x-2 py-4">
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
    </div>
  );
}
