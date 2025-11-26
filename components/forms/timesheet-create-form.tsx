"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTimesheets } from "@/lib/api-hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { CompanyLocation, Employee } from "@/lib/types";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { addDays, subDays } from "date-fns";

const timesheetFormSchema = z.object({
  employeeIds: z
    .array(z.string())
    .min(1, { message: "Employee ID is required" }),
  companyLocationId: z.string().min(1, { message: "Location is required" }),
  timeIn: z.string().refine(
    (value) => {
      const selected = new Date(value);
      const now = new Date();

      const min = subDays(now, 2);
      const max = addDays(now, 2);

      return selected >= min && selected <= max;
    },
    {
      message: "Date must be within the past 48 hours or next 48 hours",
    }
  ),
});

type TimesheetFormValues = z.infer<typeof timesheetFormSchema>;

export default function TimesheetCreateForm({
  closeForm,
  locations,
  employees,
  refetch,
}: {
  closeForm: () => void;
  refetch: () => void;
  locations: CompanyLocation[];
  employees: Employee[];
}) {
  const { user: userData } = useAuth();
  const company = userData?.company;
  const [openDate, setOpenDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTimesheet } = useTimesheets(company?.id ?? "");

  const formMethods = useForm<TimesheetFormValues>({
    resolver: zodResolver(timesheetFormSchema),
    defaultValues: {
      employeeIds: [],
      companyLocationId: "",
      timeIn: "",
    },
  });

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = formMethods;

  useEffect(() => {
    setValue("employeeIds", []);
  }, [watch("companyLocationId")]);

  const onSubmit = async (values: TimesheetFormValues) => {
    try {
      setIsSubmitting(true);
      const data = values.employeeIds.map((employeeId) => ({
        employeeId,
        companyLocationId: values.companyLocationId,
        timeIn: values.timeIn,
      }));
      await addTimesheet.mutateAsync(data);
      toast.success("Timesheet created successfully");
      refetch();
      closeForm();
    } catch (error) {
      toast.error("Error creating timesheet");
      console.error("Error creating timesheet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="companyLocationId" className="px-1">
            Location
          </Label>

          <Controller
            name="companyLocationId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="" id="companyLocationId">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyLocationId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyLocationId.message}
            </p>
          )}
        </div>

        <div>
          {watch("companyLocationId") && (
            <Controller
              name="employeeIds"
              control={control}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                const selectedIds = field.value;

                return (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="employees" className="px-1">
                      Employees
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="employees"
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="justify-between"
                        >
                          {selectedIds.length
                            ? `${selectedIds.length} employee(s) selected`
                            : "No employee selected"}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <Command>
                          <CommandInput
                            placeholder="Search employee..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              {getValues("companyLocationId")
                                ? "No employee found"
                                : "Select location first"}
                            </CommandEmpty>
                            <CommandGroup>
                              {employees
                                .filter((employee) => {
                                  return (
                                    getValues("companyLocationId") ===
                                    (employee.locationId ?? "")
                                  );
                                })
                                .map((employee) => {
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
                                        const newValue = selectedIds.includes(
                                          employee.id
                                        )
                                          ? selectedIds.filter(
                                              (id) => id !== employee.id
                                            )
                                          : [...selectedIds, employee.id];

                                        field.onChange(newValue);
                                      }}
                                    >
                                      {name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          selectedIds.includes(employee.id)
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
                );
              }}
            />
          )}
          {errors.employeeIds && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employeeIds.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            {/* Date Picker */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="justify-between font-normal"
                  >
                    {getValues("timeIn")
                      ? new Date(getValues("timeIn")).toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      getValues("timeIn")
                        ? new Date(getValues("timeIn"))
                        : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (!date) return;

                      // preserve the current time if already set
                      const current = getValues("timeIn")
                        ? new Date(getValues("timeIn"))
                        : new Date();
                      const updated = new Date(date);
                      updated.setHours(
                        current.getHours(),
                        current.getMinutes(),
                        current.getSeconds()
                      );

                      setValue("timeIn", updated.toISOString());
                      setOpenDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker">Time</Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={
                  getValues("timeIn")
                    ? new Date(getValues("timeIn")).toLocaleTimeString(
                        "en-GB",
                        {
                          hour12: false,
                        }
                      )
                    : ""
                }
                onChange={(e) => {
                  const [hours, minutes, seconds = "0"] =
                    e.target.value.split(":");
                  const current = getValues("timeIn")
                    ? new Date(getValues("timeIn"))
                    : new Date();
                  const updated = new Date(current);
                  updated.setHours(
                    Number(hours),
                    Number(minutes),
                    Number(seconds)
                  );
                  setValue("timeIn", updated.toISOString());
                }}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          {errors.timeIn && (
            <p className="text-red-500 text-xs mt-1">{errors.timeIn.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={closeForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

export function Calendar24() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
}
