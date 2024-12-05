import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { appointmentFilterColumns } from "../data";
import { ChevronDown } from "lucide-react";
import moment from "moment";

export default function AppointmentslFComponent({ table }) {
  const [selectedColumn, setSelectedColumn] = useState("patient_details_name");
  const disabledDays = useMemo(() => {
    return {
      before: moment().startOf("day").toDate(), // Start of today
      after: moment().add(30, "days").endOf("day").toDate(), // End of the 30th day from today
    };
  }, []);

  const selectedDerivedColumn = useMemo(() => {
    return appointmentFilterColumns.find((v) => v.value === selectedColumn);
  }, [selectedColumn]);

  return (
    <>
      <Input
        placeholder={`Search ${selectedDerivedColumn.label}...`}
        value={table.getColumn(selectedDerivedColumn.value)?.getFilterValue() ?? ""}
        onChange={(event) => table.getColumn(selectedDerivedColumn.value)?.setFilterValue(event.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <>
              <ChevronDown />
              {selectedColumn ? selectedDerivedColumn.label : "Select Filter"}
            </>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedColumn} onValueChange={setSelectedColumn}>
            {appointmentFilterColumns.map((column) => {
              return (
                <DropdownMenuRadioItem key={column.value} value={column.value}>
                  {column.label}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
          {selectedColumn && (
            <>
              <DropdownMenuSeparator />
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => setSelectedColumn("patient_details_name")}>
                  Reset Filter
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant={"outline"} className={cn("pl-3 text-left font-normal", !selectedColumn && "text-muted-foreground")}>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            {table.getColumn("date")?.getFilterValue() ? moment(table.getColumn("date")?.getFilterValue()).format("Do MMM YYYY") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={new Date(table.getColumn("date")?.getFilterValue() ?? moment().format())}
            onSelect={(cdate) => table.getColumn("date")?.setFilterValue(moment(cdate).format())}
            disabled={disabledDays}
            initialFocus
            required
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
