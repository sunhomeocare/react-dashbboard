import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import DoctorRegisterForm from "./doctorRegisterForm";

export default function CreateDoctorSheet() {
  const createDoctorsSheetOpened = useUiStateStore((state) => state.createDoctorsSheetOpened);
  const setCreateDoctorsSheetOpened = useUiStateStore((state) => state.setCreateDoctorsSheetOpened);
  const doctorSheetAction = useUiStateStore((state) => state.doctorSheetAction);

  const sheetValues = useMemo(() => {
    switch (doctorSheetAction) {
      case "create":
        return {
          title: "Create Doctor profile",
          description: "You can add new doctors to the database.",
        };
      case "update":
        return {
          title: "Update Doctor profile",
          description: "You can update existing doctor's profiles.",
        };
      default:
        return {
          title: "Create Doctor profile",
          description: "You can add new doctors to the database.",
        };
    }
  }, [doctorSheetAction]);

  return (
    <Sheet open={createDoctorsSheetOpened} onOpenChange={setCreateDoctorsSheetOpened}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{sheetValues.title}</SheetTitle>
          <SheetDescription>{sheetValues.description}</SheetDescription>
        </SheetHeader>
        <DoctorRegisterForm />
      </SheetContent>
    </Sheet>
  );
}
