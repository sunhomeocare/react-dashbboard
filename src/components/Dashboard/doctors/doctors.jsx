import React, { useMemo, useState } from "react";
import { useGetDoctors } from "@/lib/services/queries/getDoctorsQuery";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, UserRoundPen } from "lucide-react";
import CreateDoctorSheet from "./createDoctorSheet";
import { useUiStateStore } from "@/lib/store";
import AlertModal from "@/components/alertModal";
import { useToast } from "@/hooks/use-toast";
import { deleteDoctor } from "@/lib/helper/doctorHelper";
import { useQueryClient } from "@tanstack/react-query";
import { pageSourceKeys } from "@/lib/constants";

export default function Doctors() {
  const getDoctorsQuery = useGetDoctors(); //to get the data.
  const setCreateDoctorsSheetOpened = useUiStateStore((state) => state.setCreateDoctorsSheetOpened);
  const setDoctorSheetAction = useUiStateStore((state) => state.setDoctorSheetAction);
  const setUpdateDoctorData = useUiStateStore((state) => state.setUpdateDoctorData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState("");
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
        accessorKey: "designation",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Designation" />,
      },
      {
        accessorKey: "branch",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Branch" />,
      },
      {
        accessorKey: "experience",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Experience" />,
        cell: ({ row }) => <div className="flex flex-row items-center gap-x-3">{`${row.getValue("experience")}+ years`}</div>,
      },
      {
        accessorKey: "available_time",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Available Time" />,
      },
      {
        accessorKey: "available_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Available Day" />,
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
                    setCreateDoctorsSheetOpened(true);
                    setDoctorSheetAction("update");
                    setUpdateDoctorData(row.original);
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
                    setDeleteDoctorId(row.original.id);
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

  const deleteUserHandler = async () => {
    setDeleteLoader(true);
    if (!deleteDoctorId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteDoctor(deleteDoctorId);

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
        queryKey: ["getAllDoctors"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteDoctorId("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <CreateDoctorSheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete Doctor Profile"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the selected account."}
        actionHandler={deleteUserHandler}
        loader={deleteLoader}
      />
      <DataTable columns={columns} data={getDoctorsQuery.data ?? []} source={pageSourceKeys.doctors} />
    </div>
  );
}
