import React, { useMemo, useState } from "react";
import { useGetRegisteredUsers } from "@/lib/services/queries/registeredUsersQuery";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/alertModal";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Trash, UserRoundPen } from "lucide-react";
import { pageSourceKeys } from "@/lib/constants";
import CreateRegisteredUserSheet from "./createRegisteredUserSheet";
import { deleteRegisteredUser } from "@/lib/helper/registeredUserHelper";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUiStateStore } from "@/lib/store";

export default function RegisteredUsers() {
  const getRegisteredUsersQuery = useGetRegisteredUsers(); //to fetch the data
  const setCreateRegisteredUserSheetOpened = useUiStateStore((state) => state.setCreateRegisteredUserSheetOpened);
  const setRegisteredUserSheetAction = useUiStateStore((state) => state.setRegisteredUserSheetAction);
  const setUpdateRegisteredUserData = useUiStateStore((state) => state.setUpdateRegisteredUserData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteRegisteredUserId, setDeleteRegisteredUserId] = useState("");

  const qC = useQueryClient();
  const { toast } = useToast();

  const columns = useMemo(
    () => [
      {
        accessorKey: "displayName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            {row.getValue("displayName")}
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phonenumber" />,
        //TODO - mask the middle phone number digits.
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
                    setCreateRegisteredUserSheetOpened(true);
                    setRegisteredUserSheetAction("update");
                    setUpdateRegisteredUserData(row.original);
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
                    setDeleteRegisteredUserId(row.original.id);
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
    if (!deleteRegisteredUserId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteRegisteredUser(deleteRegisteredUserId);

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
        queryKey: ["getRegisteredUsers"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteRegisteredUserId("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <CreateRegisteredUserSheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete Registered User"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the selected account."}
        actionHandler={deleteUserHandler}
        loader={deleteLoader}
      />
      <DataTable columns={columns} data={getRegisteredUsersQuery.data ?? []} source={pageSourceKeys.registeredUsers} />
    </div>
  );
}
