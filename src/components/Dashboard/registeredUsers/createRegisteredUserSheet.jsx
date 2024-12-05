import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import CreateRegisteredUserForm from "./createRegisteredUserForm";

export default function CreateRegisteredUserSheet() {
  const createRegisteredUserSheetOpened = useUiStateStore((state) => state.createRegisteredUserSheetOpened);
  const setCreateRegisteredUserSheetOpened = useUiStateStore((state) => state.setCreateRegisteredUserSheetOpened);
  const registeredUserSheetAction = useUiStateStore((state) => state.registeredUserSheetAction);

  const sheetValues = useMemo(() => {
    switch (registeredUserSheetAction) {
      case "create":
        return {
          title: "Create User",
          description: "These are the user details for the mobile application login.",
        };
      case "update":
        return {
          title: "Update User",
          description: "You can update existing user's details",
        };
      default:
        return {
          title: "Create User",
          description: "These are the user details for the mobile application login.",
        };
    }
  }, [registeredUserSheetAction]);

  return (
    <Sheet open={createRegisteredUserSheetOpened} onOpenChange={setCreateRegisteredUserSheetOpened}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{sheetValues.title}</SheetTitle>
          <SheetDescription>{sheetValues.description}</SheetDescription>
        </SheetHeader>
        <CreateRegisteredUserForm />
      </SheetContent>
    </Sheet>
  );
}
