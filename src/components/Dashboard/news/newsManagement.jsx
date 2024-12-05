import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/Datatable/dataTable";
import { DataTableColumnHeader } from "@/components/Datatable/dataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, UserRoundPen } from "lucide-react";
import { pageSourceKeys } from "@/lib/constants";
import { useGetNews } from "@/lib/services/queries/getNewsQuery";
import moment from "moment";
import CreateNewsSheet from "./createNewsSheet";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import AlertModal from "@/components/alertModal";
import { deleteNews } from "@/lib/helper/newsHelper";
import { useUiStateStore } from "@/lib/store";

export default function NewsManagement() {
  const getNewsQuery = useGetNews(); //to get the data.
  const setNewsSheet = useUiStateStore((state) => state.setNewsSheet);
  const setNewsSheetAction = useUiStateStore((state) => state.setNewsSheetAction);
  const setUpdateNewsData = useUiStateStore((state) => state.setUpdateNewsData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState("");

  const qC = useQueryClient();
  const { toast } = useToast();

  const columns = useMemo(
    () => [
      {
        accessorKey: "image_url",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3 w-[200px]">
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            <div className="w-[150px] h-[150px] rounded-xl flex justify-center items-center">
              <img src={row.getValue("image_url")} alt="News Image" className="object-contain w-full h-full"/>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      },
      {
        accessorKey: "content",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Content" />,
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-x-3 w-[250px]">
            <p className="truncate">{row.getValue("content")}</p>
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
                    setDeleteNewsId(row.original.id);
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

  const deleteNewsHandler = async () => {
    setDeleteLoader(true);
    if (!deleteNewsId) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Try again later",
      });

      return;
    }

    try {
      const result = await deleteNews(deleteNewsId);

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
        queryKey: ["getNews"],
      });
      setDeleteLoader(false);
      setDeleteModalOpen(false);
      setDeleteNewsId("");
    }
  };

  return (
    <div className="flex-1 h-full w-full">
      <CreateNewsSheet />
      <AlertModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title={"Delete News"}
        description={"Are you sure? This action cannot be undone. This will permanently delete the selected news."}
        actionHandler={deleteNewsHandler}
        loader={deleteLoader}
      />
      <DataTable columns={columns} data={getNewsQuery.data ?? []} source={pageSourceKeys.newsManagement} />
    </div>
  );
}
