import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import DashboardUserRegisterForm from "./dashboardUserRegisterForm";

export default function CreateUserSheet() {
  const createDashboardUserSheetOpened = useUiStateStore((state) => state.createDashboardUserSheetOpened);
  const setCreateDashboardUserSheetOpened = useUiStateStore((state) => state.setCreateDashboardUserSheetOpened);

  return (
    <Sheet open={createDashboardUserSheetOpened} onOpenChange={setCreateDashboardUserSheetOpened}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Create User</SheetTitle>
          <SheetDescription>You can add new users to the dashboard.</SheetDescription>
        </SheetHeader>
        <DashboardUserRegisterForm />
      </SheetContent>
    </Sheet>
  );
}
