import AdminCancelAppointmentModal from "@/components/health-care/admin-cancel-appointment-modal";
import AdminDeleteAppointment from "@/components/health-care/admin-delete-appointment";

import ConfirmAppointmentModal from "@/components/health-care/confirm-appointment-modal";
import UserBadge from "@/components/health-care/user-badge";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { APPOINTMENT_STATUS_TUPLE, appointmentStatus } from "@/lib/data";
import { Appointment } from "@/lib/types/appointment";
import { Doctor } from "@/lib/types/doctor";
import { Patient } from "@/lib/types/patient";
import { AppointmentStatus } from "@/lib/types/types";
import { getFileUrl } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { format } from "date-fns";
import { WandSparkles } from "lucide-react";

export function getAdminAppointmentsTableColumns(): ColumnDef<Appointment>[] {
  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "patient",
      enableHiding: false,
      header: () => <div className="text-left">Patient</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-left font-medium">
            <UserBadge
              userName={getValue<Patient>()?.fullName}
              src={getFileUrl(doctor.avatarImage)}
            />
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const patient = row.getValue<Patient>(columnId);

        return patient?.fullName
          ?.toLowerCase()
          .includes(value.toLowerCase() ?? "");
      },
    },
    {
      accessorKey: "doctor",
      enableHiding: false,
      header: () => <div className="text-left">Doctor</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-left font-medium">
            <UserBadge
              userName={getValue<Doctor>()?.doctorName}
              src={getFileUrl(getValue<Doctor>().avatarImage)}
            />
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
          {format(new Date(getValue<string>()), "d, MMM yyyy - hh:mm a")}
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
        <div className="capitalize flex justify-center">
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
      header: () => {
        return (
          <div className="text-center flex justify-center items-center gap-2">
            Actions <WandSparkles className="size-6" />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div
            className={`
             flex justify-center items-center gap-2
              
            `}
          >
            {row.original.status !== "cancelled" &&
              row.original.status !== "scheduled" && (
                <ConfirmAppointmentModal
                  appointmentStatus={row.original.status}
                  appointmentId={row.original.$id}
                />
              )}
            {/* TODO: Implement cancel reason notification */}
            {row.original.status === "cancelled" ? (
              <AdminDeleteAppointment appointmentId={row.original.$id} />
            ) : (
              <AdminCancelAppointmentModal
                patientId={row.original.patient.$id}
                appointmentId={row.original.$id}
              />
            )}
          </div>
        );
      },
    },
  ];
  return columns;
}
