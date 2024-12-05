import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { useGetDashboardUsersQuery } from "@/lib/services/queries/manageDashboardUsersQuery";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateUserSheet from "./createUserSheet";
import AlertModal from "@/components/alertModal";
import { useToast } from "@/hooks/use-toast";
import { deleteUser, makeAdmin } from "@/lib/helper/dashboardUsersHelper";
import { useQueryClient } from "@tanstack/react-query";
import { pageSourceKeys } from "@/lib/constants";

export default function ManageDashboardUsers() {
  const getDashboardUsersQuery = useGetDashboardUsersQuery();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteUserId, setDeleteUserID] = useState("");
  const [makeAdminModalOpen, setMakeAdminModalOpen] = useState(false);
  const [makeAdminLoader, setMakeAdminLoader] = useState(false);
  const [makeAdminUserId, setMakeAdminUserId] = useState("");
  const qC = useQueryClient();
  const { toast } = useToast();

  const columns = useMemo(() => ([
    {
      accessorKey: "username",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
      cell: ({ row }) => (
        <div className="flex flex-row items-center gap-x-3">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
          {row.getValue("username")}
        </div>
      ),
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
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        return <div>{row.getValue("role")}</div>;
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
                  setDeleteUserID(row.original.id);
                }}
              >
                <div className="flex flex-row items-center gap-x-4">
                  <Trash />
                  Delete
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => {
                  setMakeAdminModalOpen(true);
                  setMakeAdminUserId(row.original.id);
                }}>
                <div className="flex flex-row items-center gap-x-4">
                  <Shield />
                  Make Admin
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]), []);

  const makeAdminHandler = async () => {
    setMakeAdminLoader(true);
    if(!makeAdminUserId){
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await makeAdmin(makeAdminUserId);

      if(!result.status){
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
        queryKey: ["getDashboardUsers"],
      });
      setMakeAdminLoader(false);
      setMakeAdminModalOpen(false);
      setMakeAdminUserId("");
    }
  }

  const deleteUserHandler = async () => {
    setDeleteLoader(true);
    if (!deleteUserId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteUser(deleteUserId);

      if(!result.status){
        console.error(result.message);

        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Try again later",
      });
      return;
      }

    } catch(error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });
      return;
    } finally {
      qC.invalidateQueries({
        queryKey: ["getDashboardUsers"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteUserID("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <CreateUserSheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete User"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the selected account."}
        actionHandler={deleteUserHandler}
        loader={deleteLoader}
      />
      <AlertModal
        open={makeAdminModalOpen}
        onOpenChange={setMakeAdminModalOpen}
        title={"Promote to Admin"}
        description={"Are you sure? This action cannot be undone. This will provide admin access to the selected account."}
        actionHandler={makeAdminHandler}
        loader={makeAdminLoader}
      />
      <DataTable columns={columns} data={getDashboardUsersQuery.data ?? []} source={pageSourceKeys.dashboardUsers} />
    </div>
  );
}
