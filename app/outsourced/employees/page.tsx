"use client";

import React, { useState } from "react";
import {
  useOutsourcedEmployees,
  useBankCodes,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useBulkUploadEmployees,
  handleApiError,
} from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Upload,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import type { EmployeeOutsourced } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

// Add Employee Modal Component
const AddEmployeeModal = ({
  isOpen,
  onClose,
  employee = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  employee?: EmployeeOutsourced | null;
}) => {
  const [formData, setFormData] = useState({
    accountNumber: employee?.accountNumber || "",
    amount: employee?.amount?.toString() || "",
    bankCode: employee?.bankCode || "",
  });

  const { user } = useAuth();
  const { data: bankCodes } = useBankCodes();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        accountNumber: formData.accountNumber,
        amount: parseInt(formData.amount),
        bankCode: formData.bankCode,
        companyId: user?.company?.id,
      };

      if (employee) {
        await updateEmployee.mutateAsync({ id: employee.id, ...data });
        toast({
          title: "Employee Updated",
          description: "Employee details have been updated successfully.",
        });
      } else {
        await createEmployee.mutateAsync(data);
        toast({
          title: "Employee Added",
          description: "New employee has been added successfully.",
        });
      }

      onClose();
      setFormData({ accountNumber: "", amount: "", bankCode: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? "Update employee details below"
              : "Enter employee details to add them to the outsourced payroll system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="1234567890"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              min="1"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankCode">Bank</Label>
            <Select
              value={formData.bankCode}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bankCode: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent>
                {bankCodes?.bankCodes.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name} ({bank.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEmployee.isPending || updateEmployee.isPending}
            >
              {createEmployee.isPending || updateEmployee.isPending
                ? "Saving..."
                : employee
                ? "Update Employee"
                : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Bulk Upload Modal Component
const BulkUploadModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const { data: bankCodes } = useBankCodes();
  const bulkUpload = useBulkUploadEmployees();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setUploadErrors([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await bulkUpload.mutateAsync(selectedFile);
      toast({
        title: "Upload Successful",
        description: "Employees have been uploaded successfully.",
      });
      onClose();
      setSelectedFile(null);
    } catch (error: any) {
      const errorMsg = handleApiError(error);
      if (error.response?.data?.detail?.errors) {
        setUploadErrors(error.response.data.detail.errors);
      } else {
        toast({
          title: "Upload Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = `account_number,amount,bank_code
1234567890,50000,01
0987654321,75000,03
1122334455,100000,11`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Employees</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple employees at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bank Codes Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bank Codes Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-32 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Bank Name</TableHead>
                      <TableHead className="text-xs">Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankCodes?.bankCodes.map((bank) => (
                      <TableRow key={bank.code}>
                        <TableCell className="text-xs">{bank.name}</TableCell>
                        <TableCell className="text-xs font-mono">
                          {bank.code}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* CSV Format Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">CSV Format Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your CSV file must have exactly 3 columns: account_number,
                amount, bank_code
              </p>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Example:</Label>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {`account_number,amount,bank_code
1234567890,50000,01
0987654321,75000,03
1122334455,100000,11`}
                </pre>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {selectedFile.name} selected
              </p>
            )}
          </div>

          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">
                    Upload Failed - Please fix these errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {uploadErrors.map((error, index) => (
                      <li key={index} className="text-xs">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || bulkUpload.isPending}
          >
            {bulkUpload.isPending ? "Uploading..." : "Upload Employees"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  employee,
}: {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeOutsourced | null;
}) => {
  const deleteEmployee = useDeleteEmployee();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!employee) return;

    try {
      await deleteEmployee.mutateAsync(employee.id);
      toast({
        title: "Employee Deleted",
        description: "Employee has been removed from the system.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this employee? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {employee && (
          <div className="bg-muted p-3 rounded">
            <p>
              <strong>Account:</strong> {employee.accountNumber}
            </p>
            <p>
              <strong>Amount:</strong> KES {employee.amount.toLocaleString()}
            </p>
            <p>
              <strong>Bank Code:</strong> {employee.bankCode}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteEmployee.isPending}
          >
            {deleteEmployee.isPending ? "Deleting..." : "Delete Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Employee Management Page
export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeOutsourced | null>(null);
  const [deletingEmployee, setDeletingEmployee] =
    useState<EmployeeOutsourced | null>(null);

  const {
    data: employees,
    isLoading,
    error,
  } = useOutsourcedEmployees(showInactive);
  const { data: bankCodes } = useBankCodes();

  // @ts-ignore
  const employeeList = employees?.items || [];

  const filteredEmployees =
    employeeList?.filter(
      (employee) =>
        employee.accountNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.bankCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getBankName = (bankCode: string) => {
    return (
      bankCodes?.bankCodes.find((bank) => bank.code === bankCode)?.name ||
      bankCode
    );
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load employees. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage employees in your outsourced payroll system
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsBulkModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employeeList?.filter((emp) => emp.isActive).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Amount
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES{" "}
              {employeeList
                ?.filter((emp) => emp.isActive)
                .reduce((sum, emp) => sum + emp.amount, 0)
                .toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by account number or bank code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Button
              variant={showInactive ? "default" : "outline"}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? "Show Active Only" : "Include Inactive"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No employees found</p>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first employee"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Amount (KES)</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono">
                      {employee.accountNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      KES {employee.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getBankName(employee.bankCode)}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {employee.bankCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.isActive ? "default" : "secondary"}
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingEmployee(employee)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingEmployee(employee)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AddEmployeeModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
      />

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        employee={deletingEmployee}
      />
    </div>
  );
}
