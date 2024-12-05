import { useGetAppointmentRatingsQuery } from "@/lib/services/queries/appointmentsQuery";
import React, { useMemo, useState } from "react";
import moment from "moment";
import { MoreHorizontal, Trash } from "lucide-react";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { pageSourceKeys } from "@/lib/constants";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import RatingComponent from "./ratingComponent";

export default function AppointmentRatings() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "rating",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            <RatingComponent rating={row.getValue("rating").toString()} />
          </div>
        ),
      },
      {
        accessorKey: "review",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Review" />,
      },
      {
        accessorKey: "appointments.doctor_details.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor Name" />,
      },
      {
        accessorKey: "appointments.date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => {
          const formatedData = moment(row.getValue("appointments.date")).format("Do MMM YYYY");
          return <div>{formatedData}</div>;
        },
        filterFn: (row, columnId, filterValue) => {
          return moment(row.original[columnId]).isSame(moment(filterValue), "day");
        },
      },
      {
        accessorKey: "appointments.patient_details.Users.displayName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="User Name" />,
      },
      {
        accessorKey: "appointments.patient_details.Users.phoneNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="PhoneNumber" />,
      },
      {
        accessorKey: "appointments.time_slots.display_text",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Slot" />,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created at" />,
        cell: ({ row }) => {
          const formatedData = moment(row.getValue("created_at")).format("Do MMM YYYY - hh:mm a");
          return <div>{formatedData}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          //row.original -> to get the data.
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-4 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  asChild
                  onClick={() => {
                    console.error("samplee");
                  }}
                >
                  <div className="flex flex-row items-center gap-x-4">
                    <Trash />
                    Delete
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );
  const getAppointmentRatingsQuery = useGetAppointmentRatingsQuery();
  
  return (
    <div className="flex-1 w-full h-full grid grid-cols-3 grid-rows-5 gap-4">
      <div className="col-span-3 w-full h-full row-span-4">
        <DataTable columns={columns} data={getAppointmentRatingsQuery.data ?? []} source={pageSourceKeys.appointmentRatings} />
      </div>
    </div>
  );
}
