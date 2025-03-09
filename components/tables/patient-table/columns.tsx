import CancelAppointmentModal from "@/components/health-care/cancel-appointment-modal";
import UserBadge from "@/components/health-care/user-badge";
import UpdateAppointmentModal from "@/components/health-care/update-appointment-modal";
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
import { AppointmentStatus } from "@/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { format } from "date-fns";
import { getFileUrl } from "@/lib/utils";

export function getPatientAppointmentsTableColumns(
  doctors: Doctor[]
): ColumnDef<Appointment>[] {
  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "doctor",
      enableHiding: false,
      header: () => <div className="text-left">Doctor</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-left font-medium">
            <UserBadge
              userName={getValue<Doctor>()?.doctorName}
              src={getFileUrl(getValue<Doctor>()?.avatarImage)}
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
        return <div className="text-center">Actions</div>;
      },
      cell: ({ row }) => {
        console.log({ row });
        return (
          <div
            className={`
              flex items-center gap-2 justify-center
            `}
          >
            {row.original.status === "pending" && (
              <UpdateAppointmentModal
                doctors={doctors}
                appointment={row.original}
              />
            )}

            {row.original.status !== "cancelled" && (
              <CancelAppointmentModal
                appointmentStatus={row.original.status}
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
