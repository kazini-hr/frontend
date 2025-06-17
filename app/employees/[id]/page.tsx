"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  User,
  FileText,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Send,
  Upload,
  Eye,
} from "lucide-react";
import { useEmployeeStore } from "@/store/employees";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PayrollCalculator } from "@/components/forms/PayrollCalculator";
import type { Employee } from "@/types/employee";

// Mock data for employee details
const getEmployeePerformance = (employeeId: string) => [
  { period: "Q1 2024", rating: 4.5, goals: 8, completed: 7 },
  { period: "Q4 2023", rating: 4.2, goals: 10, completed: 9 },
  { period: "Q3 2023", rating: 4.7, goals: 6, completed: 6 },
];

const getEmployeeLeaves = (employeeId: string) => [
  {
    id: 1,
    type: "Annual Leave",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    days: 7,
    status: "approved",
  },
  {
    id: 2,
    type: "Sick Leave",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    days: 3,
    status: "approved",
  },
  {
    id: 3,
    type: "Annual Leave",
    startDate: "2024-01-05",
    endDate: "2024-01-08",
    days: 4,
    status: "approved",
  },
];

const getEmployeeDocuments = (employeeId: string) => [
  {
    id: 1,
    name: "Employment Contract",
    type: "contract",
    uploadDate: "2023-01-15",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "ID Copy",
    type: "identification",
    uploadDate: "2023-01-15",
    size: "1.2 MB",
  },
  {
    id: 3,
    name: "Academic Certificates",
    type: "education",
    uploadDate: "2023-01-15",
    size: "3.1 MB",
  },
  {
    id: 4,
    name: "Performance Review Q1",
    type: "performance",
    uploadDate: "2024-04-01",
    size: "856 KB",
  },
];

interface EditEmployeeDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Employee>) => void;
  isLoading: boolean;
}

function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone || "",
    department: employee.department,
    position: employee.position,
    salary: employee.salary?.toString() || "",
    status: employee.status,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        department: employee.department,
        position: employee.position,
        salary: employee.salary?.toString() || "",
        status: employee.status,
      });
    }
  }, [employee, open]);

  const handleSave = () => {
    const updates: Partial<Employee> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
      status: formData.status as Employee["status"],
    };
    onSave(updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee information. Changes will be saved to their profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary (KES)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, salary: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as "active" | "inactive" | "terminated",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button outline onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { employees, updateEmployee, isLoading, fetchEmployees } =
    useEmployeeStore();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const employeeId = params.id as string;

  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [fetchEmployees, employees.length]);

  useEffect(() => {
    const foundEmployee = employees.find((emp) => emp.id === employeeId);
    if (foundEmployee) {
      setEmployee(foundEmployee);
    } else if (employees.length > 0) {
      // Employee not found
      router.push("/employees");
    }
  }, [employees, employeeId, router]);

  const handleUpdateEmployee = async (updates: Partial<Employee>) => {
    if (!employee) return;

    try {
      await updateEmployee(employee.id, updates);
      setEmployee((prev) => (prev ? { ...prev, ...updates } : null));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const performance = getEmployeePerformance(employee.id);
  const leaves = getEmployeeLeaves(employee.id);
  const documents = getEmployeeDocuments(employee.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button outline className="h-5 w-5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Employee Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage employee information
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button outline className="h-5 w-5">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button outline className="h-5 w-5">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Employee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Employee Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="text-lg">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <p className="text-lg text-muted-foreground">
                    {employee.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.department}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(employee.status)}
                    >
                      {employee.status}
                    </Badge>
                    <Badge variant="outline">ID: {employee.employeeId}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(employee.hireDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 365 * 100)
                      ) / 100}
                    </div>
                    <div className="text-xs text-muted-foreground">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {employee.salary
                        ? formatCurrency(employee.salary)
                        : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">Monthly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5/5</div>
            <p className="text-xs text-muted-foreground">Latest rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{employee.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                  </div>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{employee.phone}</p>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{employee.department}</p>
                    <p className="text-sm text-muted-foreground">Department</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{employee.position}</p>
                    <p className="text-sm text-muted-foreground">Position</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {formatDate(employee.hireDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">Hire Date</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{employee.employeeId}</p>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                  </div>
                </div>
                {employee.salary && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {formatCurrency(employee.salary)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monthly Salary
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(employee.status)}
                    >
                      {employee.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Employment Status
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      Performance review completed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rating: 4.5/5 - Exceeds expectations
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      Leave request approved
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Annual leave for 7 days in March
                    </p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Training completed</p>
                    <p className="text-sm text-muted-foreground">
                      Advanced React Development certification
                    </p>
                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <CardDescription>
                Quarterly performance reviews and ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.map((review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {review.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rating
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{review.period}</p>
                        <p className="text-sm text-muted-foreground">
                          Goals: {review.completed}/{review.goals} completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {Math.round((review.completed / review.goals) * 100)}%
                        Goal Achievement
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (review.completed / review.goals) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Competencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Skills</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Communication</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Leadership</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Problem Solving</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complete React certification</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lead team project</span>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mentor junior developers</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Improve system architecture</span>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leave Tab */}
        <TabsContent value="leave" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sick Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">7</div>
                  <p className="text-sm text-muted-foreground">
                    Days Remaining
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    7 of 10 days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">3</div>
                  <p className="text-sm text-muted-foreground">
                    Days Remaining
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 of 5 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>
                Recent leave requests and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getLeaveStatusIcon(leave.status)}
                      <div>
                        <p className="font-medium">{leave.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(leave.startDate)} -{" "}
                          {formatDate(leave.endDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {leave.days} day{leave.days > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        leave.status === "approved" ? "default" : "secondary"
                      }
                      className={
                        leave.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : leave.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Base Salary
                  </span>
                  <span className="font-medium">
                    {employee.salary ? formatCurrency(employee.salary) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Allowances
                  </span>
                  <span className="font-medium">{formatCurrency(8000)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gross Salary</span>
                  <span className="font-bold text-lg">
                    {employee.salary
                      ? formatCurrency(employee.salary + 8000)
                      : "N/A"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Next payment:{" "}
                  {new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    1
                  ).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deductions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    PAYE Tax
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(15000)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">NHIF</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(1700)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">NSSF</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(2400)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Housing Levy
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(1920)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Deductions</span>
                  <span className="font-bold text-red-600">
                    -{formatCurrency(21020)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Net Pay Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-green-600">
                    {employee.salary
                      ? formatCurrency(employee.salary + 8000 - 21020)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Net Salary
                  </p>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">
                      Take-home:{" "}
                      {employee.salary
                        ? Math.round(
                            ((employee.salary + 8000 - 21020) /
                              (employee.salary + 8000)) *
                              100
                          )
                        : 0}
                      % of gross
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PayrollCalculator
              defaultValues={{
                basicSalary: employee.salary || 0,
                allowances: 8000,
                currency: "KES",
              }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Recent payroll records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    month: "March 2024",
                    gross: employee.salary ? employee.salary + 8000 : 0,
                    net: employee.salary ? employee.salary + 8000 - 21020 : 0,
                    status: "Paid",
                  },
                  {
                    month: "February 2024",
                    gross: employee.salary ? employee.salary + 8000 : 0,
                    net: employee.salary ? employee.salary + 8000 - 21020 : 0,
                    status: "Paid",
                  },
                  {
                    month: "January 2024",
                    gross: employee.salary ? employee.salary + 8000 : 0,
                    net: employee.salary ? employee.salary + 8000 - 21020 : 0,
                    status: "Paid",
                  },
                ].map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{record.month}</p>
                      <p className="text-sm text-muted-foreground">
                        Gross: {formatCurrency(record.gross)} • Net:{" "}
                        {formatCurrency(record.net)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {record.status}
                      </Badge>
                      <Button color="zinc">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Employee Documents</h3>
              <p className="text-sm text-muted-foreground">
                Manage and view employee documents and files
              </p>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.size} • Uploaded{" "}
                          {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button color="zinc" className="h-5 w-5">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button color="zinc" className="h-5 w-5">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button color="zinc" className="h-5 w-5">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Personal Documents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ID Copy/Passport</li>
                    <li>• Birth Certificate</li>
                    <li>• Marriage Certificate</li>
                    <li>• Next of Kin Details</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Professional Documents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Employment Contract</li>
                    <li>• Job Description</li>
                    <li>• Performance Reviews</li>
                    <li>• Training Certificates</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Educational Documents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Academic Certificates</li>
                    <li>• Professional Certifications</li>
                    <li>• Training Records</li>
                    <li>• Skill Assessments</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Compliance Documents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tax Returns</li>
                    <li>• NHIF Registration</li>
                    <li>• NSSF Registration</li>
                    <li>• Medical Reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <EditEmployeeDialog
        employee={employee}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdateEmployee}
        isLoading={isLoading}
      />
    </div>
  );
}
