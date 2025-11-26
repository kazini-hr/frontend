"use client";

import { CompanyLocation, Employee } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TimesheetsFilters({
  locations,
  employees,
  setFilters,
}: {
  locations: CompanyLocation[];
  employees: Employee[];
  setFilters: any;
}) {
  const ALL_SHIFTS = "all";
  const ACTIVE_SHIFTS = "active";
  const INACTIVE_SHIFTS = "inactive";

  const shiftType = {
    [ACTIVE_SHIFTS]: "Active Shift",
    [INACTIVE_SHIFTS]: "Completed Shift",
    [ALL_SHIFTS]: "All Shifts",
  };

  const shiftTypeMapping = {
    [ALL_SHIFTS]: undefined,
    [ACTIVE_SHIFTS]: true,
    [INACTIVE_SHIFTS]: false,
  };

  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  const [openEmployeePopover, setOpenEmployeePopover] = useState(false);
  const [openStartDatePopover, setOpenStartDatePopover] = useState(false);
  const [openEndDatePopover, setOpenEndDatePopover] = useState(false);

  const defaultEndDate = new Date();
  const defaultStartDate = new Date(
    defaultEndDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [locationIds, setLocationIds] = useState<string[]>([]);
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [activeShift, setActiveShift] = useState<string>(ALL_SHIFTS);

  const clearFilters = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setLocationIds([]);
    setEmployeeIds([]);
    setActiveShift(ALL_SHIFTS);
  };

  const applyFilters = () => {
    setFilters({
      startDate,
      endDate,
      locationIds: locationIds.length ? locationIds : undefined,
      employeeIds: employeeIds.length ? employeeIds : undefined,
      activeShift:
        shiftTypeMapping[activeShift as keyof typeof shiftTypeMapping],
    });
  };

  useEffect(() => {
    clearFilters();
    applyFilters();
  }, []);

  return (
    <>
      <div className="flex items-center my-4 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="startDate" className="px-1">
            Start Date
          </Label>
          <Popover
            open={openStartDatePopover}
            onOpenChange={setOpenStartDatePopover}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="startDate"
                className="w-48 justify-between font-normal"
              >
                {startDate ? startDate.toLocaleDateString() : "Select date"}
                <ChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setStartDate(date);
                  setOpenStartDatePopover(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="endDate" className="px-1">
            End Date
          </Label>
          <Popover
            open={openEndDatePopover}
            onOpenChange={setOpenEndDatePopover}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="endDate"
                className="w-48 justify-between font-normal"
              >
                {endDate ? endDate.toLocaleDateString() : "Select date"}
                <ChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setEndDate(date);
                  setOpenEndDatePopover(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="location" className="px-1">
            Locations
          </Label>
          <Popover
            open={openLocationPopover}
            onOpenChange={setOpenLocationPopover}
          >
            <PopoverTrigger asChild>
              <Button
                id="location"
                variant="outline"
                role="combobox"
                aria-expanded={openLocationPopover}
                className="w-[200px] justify-between"
              >
                {locationIds.length
                  ? locationIds.length + " location(s) selected"
                  : "No location selected"}
                <ChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput
                  placeholder="Search location..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {locations.map((location) => (
                      <CommandItem
                        key={location.id}
                        value={location.name}
                        onSelect={() => {
                          setLocationIds((prev) =>
                            prev.includes(location.id)
                              ? prev.filter((id) => id !== location.id)
                              : [...prev, location.id]
                          );
                        }}
                      >
                        {location.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            locationIds.includes(location.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="employees" className="px-1">
            Employees
          </Label>
          <Popover
            open={openEmployeePopover}
            onOpenChange={setOpenEmployeePopover}
          >
            <PopoverTrigger asChild>
              <Button
                id="employees"
                variant="outline"
                role="combobox"
                aria-expanded={openEmployeePopover}
                className="w-[200px] justify-between"
              >
                {employeeIds.length
                  ? employeeIds.length + " employee(s) selected"
                  : "No employee selected"}
                <ChevronDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput
                  placeholder="Search employee..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No employee found.</CommandEmpty>
                  <CommandGroup>
                    {employees.map((employee) => {
                      const name =
                        [
                          employee.firstName,
                          employee.middleName,
                          employee.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") +
                        " - " +
                        employee.internalEmployeeId;
                      return (
                        <CommandItem
                          key={employee.id}
                          value={name}
                          onSelect={() => {
                            setEmployeeIds((prev) =>
                              prev.includes(employee.id)
                                ? prev.filter((id) => id !== employee.id)
                                : [...prev, employee.id]
                            );
                          }}
                        >
                          {name}
                          <Check
                            className={cn(
                              "ml-auto",
                              employeeIds.includes(employee.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="shiftType" className="px-1">
            Shift Type
          </Label>
          <Select value={activeShift} onValueChange={setActiveShift}>
            <SelectTrigger className="w-[200px]" id="shiftType">
              <SelectValue placeholder="Shift Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(shiftType).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-start gap-4 mb-4">
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </>
  );
}
