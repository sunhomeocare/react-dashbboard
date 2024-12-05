"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useUiStateStore } from "@/lib/store";
import { pageSourceKeys } from "@/lib/constants";

export function DataTableViewOptions({ table, source }) {
  const setCreateDashboardUserSheetOpened = useUiStateStore((state) => state.setCreateDashboardUserSheetOpened);

  const setCreateRegisteredUserSheetOpened = useUiStateStore((state) => state.setCreateRegisteredUserSheetOpened);
  const setRegisteredUserSheetAction = useUiStateStore((state) => state.setRegisteredUserSheetAction);

  const setCreatePatientSheetOpened = useUiStateStore((state) => state.setCreatePatientSheetOpened);
  const setCreatePatientSheetAction = useUiStateStore((state) => state.setCreatePatientSheetAction);

  const setCreateDoctorsSheetOpened = useUiStateStore((state) => state.setCreateDoctorsSheetOpened);
  const setDoctorSheetAction = useUiStateStore((state) => state.setDoctorSheetAction);

  const setDoctorUnavailSheet = useUiStateStore((state) => state.setDoctorUnavailSheet);

  const setAppointmentsSheet = useUiStateStore((state) => state.setAppointmentsSheet);
  const setAppointmentsSheetAction = useUiStateStore((state) => state.setAppointmentsSheetAction);

  const setNewsSheet = useUiStateStore((state) => state.setNewsSheet);
  const setNewsSheetAction = useUiStateStore((state) => state.setNewsSheetAction);

  return (
    <div className="flex flex-row justify-end gap-x-2">
      {source === pageSourceKeys.dashboardUsers ? (
        <Button size="sm" className="hidden h-8 lg:flex" onClick={() => setCreateDashboardUserSheetOpened(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create
        </Button>
      ) : null}
      {source === pageSourceKeys.patientUsers ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setCreatePatientSheetOpened(true);
            setCreatePatientSheetAction("create");
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Patient
        </Button>
      ) : null}
      {source === pageSourceKeys.registeredUsers ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setCreateRegisteredUserSheetOpened(true);
            setRegisteredUserSheetAction("create");
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create User
        </Button>
      ) : null}
      {source === pageSourceKeys.doctors ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setCreateDoctorsSheetOpened(true);
            setDoctorSheetAction("create");
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create
        </Button>
      ) : null}
      {source === pageSourceKeys.doctorsUnavailability ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setDoctorUnavailSheet(true);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Unavailability
        </Button>
      ) : null}
      {source === pageSourceKeys.appointments ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setAppointmentsSheet(true);
            setAppointmentsSheetAction("create");
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Appointment
        </Button>
      ) : null}
      {source === pageSourceKeys.newsManagement ? (
        <Button
          size="sm"
          className="hidden h-8 lg:flex"
          onClick={() => {
            setNewsSheet(true);
            setNewsSheetAction("create");
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add News
        </Button>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden h-8 lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .map((column) => {
              //TODO - to add human readable mapping for the view dropdown.
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
