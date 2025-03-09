import AdminDeleteDoctorConfirmationDialog from "@/components/health-care/admin-delete-doctor";

import UserBadge from "@/components/health-care/user-badge";

import { Doctor } from "@/lib/types/doctor";
import { getFileUrl } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { WandSparkles } from "lucide-react";

export function getAdminDoctorsTableColumns(): ColumnDef<Doctor>[] {
  const columns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "id", // Use "id" or another key if needed
      enableHiding: false,
      header: () => <div className="text-center">#</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center text-[16px] font-bold text-secondary">
            {row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "doctorName",
      enableHiding: false,
      header: () => <div className="text-left">Doctor</div>,
      cell: ({ getValue, row }) => {
        // console.log(getValue<Doctor>());
        return (
          <div className="text-left font-medium">
            <UserBadge
              userName={getValue<string>()}
              src={getFileUrl(row.original.avatarImage)}
            />
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        const doctorName = row.getValue<string>(columnId);
        console.log(row.getValue<string>(columnId));
        return doctorName?.toLowerCase().includes(value.toLowerCase() ?? "");
      },
    },

    {
      accessorKey: "specialty",
      header: ({ column }) => {
        return <div className="text-left">Specialty</div>;
      },
      cell: ({ getValue }) => (
        <div className="capitalize text-nowrap ">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "startWorkingDate",
      header: ({ column }) => {
        return <div className="text-left">Start Working Date</div>;
      },
      cell: ({ getValue }) => (
        <div className="capitalize text-nowrap ">
          {format(new Date(getValue<string>()), "d, MMM yyyy - hh:mm a")}
        </div>
      ),
    },
    {
      accessorKey: "experience",
      header: ({ column }) => {
        return <div className="text-left">Experience</div>;
      },
      cell: ({ getValue }) => (
        <div className="text-left">{getValue<string>()} Years</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => {
        return <div className="text-left">Mobile</div>;
      },
      cell: ({ getValue }) => (
        <div className="capitalize text-nowrap ">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return <div className="text-left">Email</div>;
      },
      cell: ({ getValue }) => (
        <div className="capitalize text-nowrap ">{getValue<string>()}</div>
      ),
    },
    // {
    //   accessorKey: "status",
    //   filterFn: (row, columnId, value) => {
    //     if (value === "all") return true; // Allow all rows
    //     const status = row.getValue<AppointmentStatus>(columnId);
    //     return status === value; // Only match the selected status
    //   },

    //   header: ({ table }) => {
    //     return (
    //       <Select
    //         value={
    //           (table.getColumn("status")?.getFilterValue() as string) ?? "all"
    //         }
    //         onValueChange={(value: AppointmentStatus) => {
    //           console.log("changed", value);
    //           table.getColumn("status")?.setFilterValue(value);
    //         }}
    //       >
    //         <SelectTrigger className="flex gap-1">
    //           <span>Status</span>
    //         </SelectTrigger>
    //         <SelectContent className="bg-darkPrimary">
    //           <SelectGroup>
    //             <SelectItem
    //               onSelect={() => {
    //                 table.getColumn("status")?.setFilterValue("all"); // Clear the filter
    //               }}
    //               className="flex capitalize"
    //               value={"all"}
    //             >
    //               All
    //             </SelectItem>
    //             {APPOINTMENT_STATUS_TUPLE.map((stat, i) => (
    //               <SelectItem
    //                 onSelect={() =>
    //                   table.getColumn("status")?.setFilterValue(stat)
    //                 }
    //                 className="flex capitalize"
    //                 key={i}
    //                 value={stat}
    //               >
    //                 {stat}
    //               </SelectItem>
    //             ))}
    //           </SelectGroup>
    //         </SelectContent>
    //       </Select>
    //     );
    //   },
    //   cell: ({ getValue }) => (
    //     <div className="capitalize flex justify-center">
    //       <Badge
    //         className={clsx(
    //           {
    //             "text-[#24AE7C] bg-[#0D2A1F]": getValue() === "scheduled",
    //             "text-[#79B5EC] bg-[#152432]": getValue() === "pending",
    //             "text-[#F37877] bg-[#3E1716]": getValue() === "cancelled",
    //           },
    //           "px-2 gap-2"
    //         )}
    //       >
    //         {appointmentStatus[getValue<AppointmentStatus>()]}
    //         {getValue<AppointmentStatus>()}
    //       </Badge>
    //     </div>
    //   ),
    // },
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
            <AdminDeleteDoctorConfirmationDialog
              doctorId={row.original.$id}
              avatarImageId={row.original.avatarImage}
            />
          </div>
        );
      },
    },
  ];
  return columns;
}
