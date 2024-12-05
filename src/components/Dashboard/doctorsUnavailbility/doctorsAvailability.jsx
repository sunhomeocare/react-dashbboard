import React, { useMemo, useState } from "react";
import { useGetDoctorsUnavailability } from "@/lib/services/queries/getDoctorsUnavailability";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import DoctorUnavailabilitySheet from "./createDoctorUnavailabilitySheet";
import moment from "moment";
import { pageSourceKeys } from "@/lib/constants";
import AlertModal from "@/components/alertModal";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deleteDoctorUnavail } from "@/lib/helper/doctorUnavailHelper";

export default function DoctorsAvailability() {
  const getDoctorsUnavailabilityQuery = useGetDoctorsUnavailability(); //to fetch the data.
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteDoctorsUnavailId, setDeleteDoctorsUnavailId] = useState("");

  const qC = useQueryClient();
  const { toast } = useToast();

  const columns = useMemo(
    () => [
      {
        accessorKey: "doctor_details.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor Name" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            {row.getValue("doctor_details_name")}
          </div>
        ),
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
                    setDeleteModalOpen(true);
                    setDeleteDoctorsUnavailId(row.original.id);
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

  const deleteDoctorUnavailHandler = async () => {
    setDeleteLoader(true);
    if (!deleteDoctorsUnavailId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteDoctorUnavail(deleteDoctorsUnavailId);

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
        queryKey: ["getAllDoctorsUnavailability"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteDoctorsUnavailId("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <DoctorUnavailabilitySheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete Doctor Unavailability"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the doctor unavailability details."}
        actionHandler={deleteDoctorUnavailHandler}
        loader={deleteLoader}
      />
      <DataTable columns={columns} data={getDoctorsUnavailabilityQuery.data ?? []} source={pageSourceKeys.doctorsUnavailability} />
    </div>
  );
}
