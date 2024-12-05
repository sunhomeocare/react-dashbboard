import React from "react";
import { DataTableViewOptions } from "./dataTableViewOptions";
import { Input } from "../ui/input";
import DataTableFacetedFilter from "./dataTableFacetedFilter";
import { genderFilterValues, dashboardUserRole, branchFilterValues, appointmentStatus } from "./data";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

import PatientUsersFComponent from "./filterComponents/patientUsersFComponent";
import RegisteredUsersFComponent from "./filterComponents/registeredUsersFComponent";
import DoctorsFComponent from "./filterComponents/doctorsFComponent";
import DoctorsUnavailFComponent from "./filterComponents/doctorsUnavailFComponent";
import AppointmentslFComponent from "./filterComponents/appointmentsFComponent";
import { pageSourceKeys } from "@/lib/constants";

export default function DataTableToolbar({ table, source }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const getFilterComponent = () => {
    switch (source) {
      case pageSourceKeys.dashboardUsers:
        return (
          <>
            <Input
              placeholder="Filter Username..."
              value={table.getColumn("username")?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </>
        );
      case pageSourceKeys.patientUsers:
        return <PatientUsersFComponent table={table}/>;

      case pageSourceKeys.registeredUsers:
        return <RegisteredUsersFComponent table={table} />;

      case pageSourceKeys.doctors:
        return <DoctorsFComponent table={table} />;

      case pageSourceKeys.doctorsUnavailability:
        return <DoctorsUnavailFComponent table={table} />;

      case pageSourceKeys.appointments:
          return <AppointmentslFComponent table={table} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {getFilterComponent()}
        {source === pageSourceKeys.doctors && table.getColumn("branch") && (
          <DataTableFacetedFilter column={table.getColumn("branch")} title="Branch" options={branchFilterValues} />
        )}
        {source === pageSourceKeys.registeredUsers && table.getColumn("gender") && (
          <DataTableFacetedFilter column={table.getColumn("gender")} title="Gender" options={genderFilterValues} />
        )}
        {source === pageSourceKeys.patientUsers && table.getColumn("gender") && (
          <DataTableFacetedFilter column={table.getColumn("gender")} title="Gender" options={genderFilterValues} />
        )}
        {source === pageSourceKeys.dashboardUsers && table.getColumn("role") && (
          <DataTableFacetedFilter column={table.getColumn("role")} title="Role" options={dashboardUserRole} />
        )}
        {source === pageSourceKeys.appointments && table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={appointmentStatus} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} source={source} />
    </div>
  );
}
