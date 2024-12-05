import React, { useEffect, useMemo, useState } from "react";
import { useGetAppointments } from "@/lib/services/queries/appointmentsQuery";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, UserRoundPen, ChartLine } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import AppointmentsSheet from "./createAppointmentSheet";
import { pageSourceKeys, appointmentStatusKeys, appointmentStatus } from "@/lib/constants";
import AlertModal from "@/components/alertModal";
import { deleteAppointment, updateAppointmentStatus } from "@/lib/helper/appointmentHelper";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ProgressModal from "@/components/progressModal";
import { useUiStateStore } from "@/lib/store";

export default function Appointments() {
  //STATE
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const setAppointmentsSheet = useUiStateStore((state) => state.setAppointmentsSheet);
  const setAppointmentsSheetAction = useUiStateStore((state) => state.setAppointmentsSheetAction);
  const setUpdateAppointmentsData = useUiStateStore((state) => state.setUpdateAppointmentsData);
  const [deleteAppointmentID, setDeleteAppointmentID] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);

  //QUERIES
  const getAppointmentsQuery = useGetAppointments(); //to fetch the data

  //UTILITIES
  const qC = useQueryClient();
  const { toast } = useToast();

  const getColorsForStatus = (status) => {
    switch (status) {
      case appointmentStatus.scheduled:
        return {
          bgColor: "bg-blue-300",
          textColor: "text-foreground",
        };
      case appointmentStatus.completed:
        return {
          bgColor: "bg-green-300",
          textColor: "text-foreground",
        };
      case appointmentStatus.cancelled:
        return {
          bgColor: "bg-red-300",
          textColor: "text-foreground",
        };
      default:
        return {
          bgColor: "bg-blue-300",
          textColor: "text-foreground",
        };
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "patient_details.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient Name" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            {row.getValue("patient_details_name")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status");
          return (
            <div className={cn("p-2 bg-green-300 flex flex-row justify-center items-center rounded-xl", getColorsForStatus(status).bgColor)}>
              <p className={cn("text-xs", getColorsForStatus(status).textColor)}>{appointmentStatusKeys[status]}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => {
          const formatedData = moment(row.getValue("date")).format("Do MMM YYYY");
          return <div>{formatedData}</div>;
        },
        filterFn: (row, columnId, filterValue) => {
          return moment(row.original[columnId]).isSame(moment(filterValue), "day");
        },
      },
      {
        accessorKey: "time_slots.display_text",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Slot" />,
      },
      {
        accessorKey: "reason",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
      },
      {
        accessorKey: "doctor_details.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor Name" />,
      },
      {
        accessorKey: "doctor_details.branch",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
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
        accessorKey: "updated_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated at" />,
        cell: ({ row }) => {
          const formatedData = moment(row.getValue("updated_at")).format("Do MMM YYYY - hh:mm a");
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <div className="flex flex-row items-center gap-x-4">
                      <ChartLine />
                      Update Status
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {Object.keys(appointmentStatusKeys).map((status) => {
                        if (row.getValue("status") === status) return null;

                        return (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => {
                              setUpdateStatusModalOpen(true);
                              updateStatusHandler(row.original.id, status);
                            }}
                          >
                            {appointmentStatusKeys[status]}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem
                  asChild
                  onClick={() => {
                    setAppointmentsSheet(true);
                    setAppointmentsSheetAction("update");
                    setUpdateAppointmentsData(row.original);
                  }}
                >
                  <div className="flex flex-row items-center gap-x-4">
                    <UserRoundPen />
                    Edit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setDeleteAppointmentID(row.original.id);
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

  const updateStatusHandler = async (id, status) => {
    if (!id || !status) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await updateAppointmentStatus(id, status);

      if (!result.status) {
        console.error(result.message);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Try again later",
        });
        return;
      }

      qC.invalidateQueries({
        queryKey: ["getAppointments"],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
      return;
    } finally {
      setUpdateStatusModalOpen(false);
    }
  };

  const deleteAppointmentHandler = async () => {
    setDeleteLoader(true);
    if (!deleteAppointmentID) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteAppointment(deleteAppointmentID);

      if (!result.status) {
        console.error(result.message);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Try again later",
        });
        return;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
      return;
    } finally {
      qC.invalidateQueries({
        queryKey: ["getAppointments"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteAppointmentID("");
    }
  };

  return (
    <div className="flex-1 w-full h-full grid grid-cols-3 grid-rows-5 gap-4">
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete Appointment"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the selected appointment."}
        actionHandler={deleteAppointmentHandler}
        loader={deleteLoader}
      />
      <ProgressModal open={updateStatusModalOpen} onOpenChange={setUpdateStatusModalOpen} />
      <AppointmentsSheet />
      <div className="col-span-3 w-full h-full row-span-4">
        <DataTable columns={columns} data={getAppointmentsQuery.data ?? []} source={pageSourceKeys.appointments} />
      </div>
    </div>
  );
}
