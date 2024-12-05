import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ProgressModal({ open, onOpenChange }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Processing</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="w-full flex flex-row justify-center items-center">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        </div>
        
      </AlertDialogContent>
    </AlertDialog>
  );
}
