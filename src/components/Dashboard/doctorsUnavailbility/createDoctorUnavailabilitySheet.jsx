import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUiStateStore } from "@/lib/store";
import DoctorUnavailForm from "./doctorUnavailForm";

export default function DoctorUnavailabilitySheet() {
  const doctorUnavailSheet = useUiStateStore((state) => state.doctorUnavailSheet);
  const setDoctorUnavailSheet = useUiStateStore((state) => state.setDoctorUnavailSheet);

  return (
    <Sheet open={doctorUnavailSheet} onOpenChange={setDoctorUnavailSheet}>
      <SheetContent side="right" className="w-[30vw] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Add Doctor Unavailability</SheetTitle>
          <SheetDescription>You can add doctor's unavailability to the database.</SheetDescription>
        </SheetHeader>
        <DoctorUnavailForm />
      </SheetContent>
    </Sheet>
  );
}
