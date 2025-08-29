"use client";

import FullLayout from "@/components/layout/full-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmployees } from "@/lib/api-hooks";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeesTable from "./table";
import { Employee } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

import EmployeeDetails from "./employee-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeDetailsForm from "@/components/forms/employee-details-form";
import { CircleUserRound } from "lucide-react";
import { useCompanyLocations } from "@/lib/api-hooks";

export default function CompanyEmployees() {
  const { user: userData } = useAuth();
  const user = userData?.user;
  const company = userData?.company;

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const { getEmployees } = useEmployees(company?.id ?? "");
  const { data: companyEmployees, isPending: isEmployeesPending } =
    getEmployees;

  const { getCompanyLocations } = useCompanyLocations(company?.id ?? "");
  const { data: companyLocations, isPending: isLocationsPending } =
    getCompanyLocations;

  const handleClose = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowForm(true);
    setShowDetails(false);
  };

  if (isEmployeesPending || isLocationsPending) {
    return (
      <FullLayout title="Employees" description="Manage your employees">
        <Skeleton className="h-40 w-full" />
      </FullLayout>
    );
  }

  return (
    <FullLayout title="Employees" description="Manage your employees">
      <EmployeeDetails
        employee={selectedEmployee}
        openEdit={handleEditEmployee}
        showDetails={showDetails}
        handleClose={handleClose}
      />

      <Dialog open={showForm} onOpenChange={handleClose}>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CircleUserRound size={24} />
              {selectedEmployee ? "Edit" : "Add"} Employee
            </DialogTitle>
          </DialogHeader>
          <EmployeeDetailsForm
            employee={selectedEmployee}
            closeForm={handleClose}
            locations={companyLocations || []}
            companyId={company?.id ?? ""}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Employees</CardTitle>
          {user?.roles.includes("COMPANY_ADMIN") && (
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          )}
        </CardHeader>
        <CardContent>
          {companyEmployees?.length === 0 ? (
            <p>An error occured retrieving employees</p>
          ) : (
            <EmployeesTable
              data={companyEmployees || []}
              editButtonAction={handleViewEmployee}
            />
          )}
        </CardContent>
      </Card>
    </FullLayout>
  );
}
