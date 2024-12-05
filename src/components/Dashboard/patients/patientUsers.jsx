import React, { useMemo, useState } from "react";
import { useGetPatientDetails } from "@/lib/services/queries/patientDetailsQuery";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alertModal";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Trash, UserRoundPen } from "lucide-react";
import { pageSourceKeys } from "@/lib/constants";
import CreatePatientSheet from "./createPatientSheet";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { deletePatient } from "@/lib/helper/patientHelper";
import { useUiStateStore } from "@/lib/store";

export default function PatientUsers() {
  const getPatientDetailsQuery = useGetPatientDetails(); //to fetch the data.
  const setCreatePatientSheetOpened = useUiStateStore((state) => state.setCreatePatientSheetOpened);
  const setCreatePatientSheetAction = useUiStateStore((state) => state.setCreatePatientSheetAction);
  const setUpdateCreatePatientData = useUiStateStore((state) => state.setUpdateCreatePatientData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState("");

  const qC = useQueryClient();
  const { toast } = useToast();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "age",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
      },
      {
        accessorKey: "gender",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
        cell: ({ row }) => <div>{row.getValue("gender") === true ? "Male" : "Female"}</div>,
        filterFn: (row, columnId, filterValue) => {
          return filterValue.includes(row.original[columnId]);
        },
      },
      {
        accessorKey: "phoneNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Patient Phonenumber" />,
        //TODO - mask the middle phone number digits.
      },
      {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
      },
      {
        accessorKey: "Users.displayName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created User" />,
      },
      {
        accessorKey: "Users.phoneNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created Phonenumber" />,
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
                    setCreatePatientSheetOpened(true);
                    setCreatePatientSheetAction("update");
                    setUpdateCreatePatientData(row.original);
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
                    setDeletePatientId(row.original.id);
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

  const deletePatientHandler = async () => {
    setDeleteLoader(true);
    if (!deletePatientId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deletePatient(deletePatientId);

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
        queryKey: ["getPatientDetails"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeletePatientId("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <CreatePatientSheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete Patient"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the patient details."}
        actionHandler={deletePatientHandler}
        loader={deleteLoader}
      />
      <DataTable columns={columns} data={getPatientDetailsQuery.data ?? []} source={pageSourceKeys.patientUsers} />
    </div>
  );
}
