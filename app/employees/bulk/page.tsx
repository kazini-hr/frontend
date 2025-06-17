"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeStore, useEmployeeStoreEnhanced } from "@/store/employees";
import { Badge } from "@/components/ui/badge";
import { Users, Download, Edit, Trash2 } from "lucide-react";

export default function BulkOperationsPage() {
  const { employees, isLoading } = useEmployeeStore();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedEmployees.length === 0) return;

    switch (bulkAction) {
      case "activate":
        // await bulkUpdateEmployees(selectedEmployees, { status: 'active' })
        console.log("Activated employees:", selectedEmployees);
        break;
      case "deactivate":
        // await bulkUpdateEmployees(selectedEmployees, { status: 'inactive' })
        console.log("Deactivated employees:", selectedEmployees);
        break;
      case "export":
        // Export selected employees
        break;
    }

    setSelectedEmployees([]);
    setBulkAction("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
          <p className="text-muted-foreground">
            Manage multiple employees at once
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Employees</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedEmployees.length === employees.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">Select All ({employees.length})</span>
            </div>
            {selectedEmployees.length > 0 && (
              <Badge variant="secondary">
                {selectedEmployees.length} selected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
              >
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={(checked) =>
                    handleSelectEmployee(employee.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.department} • {employee.position}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    employee.status === "active"
                      ? "bg-green-100 text-green-800"
                      : employee.status === "inactive"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {employee.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Activate Employees
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      Deactivate Employees
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction || isLoading}
              >
                {isLoading ? "Processing..." : "Apply Action"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
