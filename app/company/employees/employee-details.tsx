"use client";

import { CircleX, CircleUserRound } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Employee, RoleKey } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ROLES } from "@/lib/constants";

export default function EmployeeDetails({
  employee,
  openEdit,
  showDetails,
  handleClose,
}: {
  employee: Employee | null;
  openEdit: (employee: Employee) => void;
  showDetails: boolean;
  handleClose: () => void;
}) {
  if (!employee) {
    return (
      <Dialog open={showDetails} onOpenChange={handleClose}>
        <DialogContent className="flex-col items-center justify-center justify-items-center">
          <CircleX size={48} /> Error Retrieving Employee Details
        </DialogContent>
      </Dialog>
    );
  }

  const fieldMapping = [
    { label: "First Name", value: employee.firstName },
    { label: "Middle Name", value: employee.middleName },
    { label: "Last Name", value: employee.lastName },
    { label: "Email", value: employee.workEmail },
    { label: "Phone", value: employee.phoneNumber },
    { label: "Employee ID", value: employee.internalEmployeeId },
    { label: "National ID", value: employee.nationalId },
    { label: "KRA PIN", value: employee.kraPin },
    { label: "SHIF", value: employee.shif },
    { label: "NSSF", value: employee.nssf },
    { label: "Roles", value: ROLES[employee.userProfile.roles[0] as RoleKey] },
    { label: "Location", value: employee.location?.name || "No Location" },
  ];

  return (
    <Dialog open={showDetails} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CircleUserRound size={24} />
            Employee Details
          </DialogTitle>
        </DialogHeader>

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

        <DialogFooter className="justify-end gap-8">
          <Button onClick={() => openEdit(employee)}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
