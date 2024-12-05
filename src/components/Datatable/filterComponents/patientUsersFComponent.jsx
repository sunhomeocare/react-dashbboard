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
import { patientUsersFilterColumns } from "../data";
import { ChevronDown } from "lucide-react";

export default function PatientUsersFComponent({ table }) {
  const [selectedColumn, setSelectedColumn] = useState("name");
  
  const selectedDerivedColumn = useMemo(() => {
    return patientUsersFilterColumns.find((v) => v.value === selectedColumn);
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
            {patientUsersFilterColumns.map((column) => {
              return <DropdownMenuRadioItem key={column.value} value={column.value}>{column.label}</DropdownMenuRadioItem>;
            })}
          </DropdownMenuRadioGroup>
          {selectedColumn && (
            <>
              <DropdownMenuSeparator />
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setSelectedColumn("name")
                  }
                >
                  Reset Filter
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
