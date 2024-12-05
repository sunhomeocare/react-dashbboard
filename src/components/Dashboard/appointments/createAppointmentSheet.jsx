import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import AppointmentCreateForm from "./appointmentCreateForm";

export default function AppointmentsSheet() {
  const appointmentsSheet = useUiStateStore((state) => state.appointmentsSheet);
  const setAppointmentsSheet = useUiStateStore((state) => state.setAppointmentsSheet);
  const appointmentsSheetAction = useUiStateStore((state) => state.appointmentsSheetAction);

  const sheetValues = useMemo(() => {
    switch (appointmentsSheetAction) {
      case "create":
        return {
          title: "Create Appointment",
          description: "You can create appointment for a patient as required.",
        };
      case "update":
        return {
          title: "Update Appointment",
          description: "You can update existing appointment.",
        };
      default:
        return {
          title: "Create Appointment",
          description: "You can create appointment for a patient as required.",
        };
    }
  }, [appointmentsSheetAction]);

  return (
    <Sheet open={appointmentsSheet} onOpenChange={setAppointmentsSheet}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>{sheetValues.title}</SheetTitle>
          <SheetDescription>{sheetValues.description}</SheetDescription>
        </SheetHeader>
        <AppointmentCreateForm />
      </SheetContent>
    </Sheet>
  );
}
