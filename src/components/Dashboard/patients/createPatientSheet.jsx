import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import CreatePatientForm from "./patientRegisterForm";

export default function CreatePatientSheet() {
  const createPatientSheetOpened = useUiStateStore((state) => state.createPatientSheetOpened);
  const setCreatePatientSheetOpened = useUiStateStore((state) => state.setCreatePatientSheetOpened);
  const createPatientSheetAction = useUiStateStore((state) => state.createPatientSheetAction);

  const sheetValues = useMemo(() => {
    switch (createPatientSheetAction) {
      case "create":
        return {
          title: "Create Patient",
          description: "Enter the patient details that needs an appointment.",
        };
      case "update":
        return {
          title: "Update Patient",
          description: "You can update existing patient's profile.",
        };
      default:
        return {
          title: "Create Patient",
          description: "Enter the patient details that needs an appointment.",
        };
    }
  }, [createPatientSheetAction]);

  return (
    <Sheet open={createPatientSheetOpened} onOpenChange={setCreatePatientSheetOpened}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{sheetValues.title}</SheetTitle>
          <SheetDescription>{sheetValues.description}</SheetDescription>
        </SheetHeader>
        <CreatePatientForm />
      </SheetContent>
    </Sheet>
  );
}
