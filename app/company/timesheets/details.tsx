import { Label } from "@/components/ui/label";
import { Timesheet } from "@/lib/types";
import { dateFormatter } from "@/lib/utils";

export function TimesheetDetails({
  closeForm,
  timesheet,
}: {
  closeForm: () => void;
  timesheet: Timesheet | null;
}) {
  if (!timesheet) {
    return (
      <div className="flex items-center justify-center font-bold">
        No timesheet found
      </div>
    );
  }

  const fieldMapping = [
    {
      label: "Employee Name",
      value: `${timesheet.employee.firstName} ${timesheet.employee.lastName}`,
    },
    { label: "Employee Email", value: timesheet.employee.workEmail },
    { label: "Employee ID", value: timesheet.employee.internalEmployeeId },
    { label: "Location", value: timesheet.companyLocation.name },
    {
      label: "Time In",
      value: dateFormatter.format(new Date(timesheet.timeIn)),
    },
    {
      label: "Time Out",
      value: timesheet.timeOut
        ? dateFormatter.format(new Date(timesheet.timeOut))
        : "Active Shift",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fieldMapping.map((field) => (
        <div className="space-y-2" key={field.label}>
          <Label htmlFor={field.label} className="underline font-bold">
            {field.label}
          </Label>
          <div id={field.label}>{field.value || "N/A"}</div>
        </div>
      ))}
    </div>
  );
}
