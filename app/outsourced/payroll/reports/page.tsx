"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockPayrollCycles = [
  {
    id: "cycle_001",
    cycleCount: 1,
    runDate: "2024-01-30",
    employeeCount: 25,
    totalGrossPay: 2500000,
    totalNetPay: 2000000,
    totalPayeTax: 375000,
    totalKaziniHRFees: 40000,
    totalDisbursementAmount: 2040000,
    hasRun: true,
    completed: true,
    status: "COMPLETED",
  },
  {
    id: "cycle_002",
    cycleCount: 2,
    runDate: "2024-02-29",
    employeeCount: 28,
    totalGrossPay: 2800000,
    totalNetPay: 2240000,
    totalPayeTax: 420000,
    totalKaziniHRFees: 44800,
    totalDisbursementAmount: 2284800,
    hasRun: true,
    completed: false,
    status: "PROCESSED",
  },
  {
    id: "cycle_003",
    cycleCount: 3,
    runDate: "2024-03-30",
    employeeCount: 30,
    totalGrossPay: 3000000,
    totalNetPay: 2400000,
    totalPayeTax: 450000,
    totalKaziniHRFees: 48000,
    totalDisbursementAmount: 2448000,
    hasRun: false,
    completed: false,
    status: "PENDING",
  },
];

// Individual Report Modal
const ReportDetailModal = ({
  isOpen,
  onClose,
  cycle,
}: {
  isOpen: boolean;
  onClose: () => void;
  cycle: any;
}) => {
  const { toast } = useToast();

  const downloadReport = (format: "pdf" | "excel") => {
    toast({
      title: "Download Started",
      description: `Generating ${format.toUpperCase()} report for Cycle #${
        cycle.cycleCount
      }`,
    });
  };

  const handleDisburse = () => {
    toast({
      title: "Disbursement Initiated",
      description: "Payments are being processed via SasaPay",
    });
    onClose();
  };

  if (!cycle) return null;

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Payroll Report - Cycle #{cycle.cycleCount}</DialogTitle>
          <DialogDescription>
            Detailed report for payroll processed on{" "}
            {new Date(cycle.runDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {cycle.employeeCount}
                </div>
                <div className="text-xs text-muted-foreground">Employees</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(cycle.totalGrossPay)}
                </div>
                <div className="text-xs text-muted-foreground">Gross Pay</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(cycle.totalPayeTax)}
                </div>
                <div className="text-xs text-muted-foreground">PAYE Tax</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(cycle.totalKaziniHRFees)}
                </div>
                <div className="text-xs text-muted-foreground">
                  KaziniHR Fees
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  cycle.completed
                    ? "default"
                    : cycle.hasRun
                    ? "secondary"
                    : "outline"
                }
              >
                {cycle.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Run Date: {new Date(cycle.runDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadReport("pdf")}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadReport("excel")}
              >
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              {cycle.hasRun && !cycle.completed && (
                <Button size="sm" onClick={handleDisburse}>
                  Disburse Now
                </Button>
              )}
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h4 className="font-medium mb-3">Financial Breakdown</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Gross Pay</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cycle.totalGrossPay)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    PAYE Tax Deducted
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    -{formatCurrency(cycle.totalPayeTax)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Net Pay to Employees
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(cycle.totalNetPay)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    KaziniHR Service Fees (2%)
                  </TableCell>
                  <TableCell className="text-right text-purple-600">
                    {formatCurrency(cycle.totalKaziniHRFees)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t font-bold">
                  <TableCell>Total Disbursement Amount</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(cycle.totalDisbursementAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCycle, setSelectedCycle] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Mock loading state - replace with actual API call
  const [isLoading] = useState(false);

  const filteredCycles = mockPayrollCycles.filter((cycle) => {
    const matchesSearch =
      cycle.cycleCount.toString().includes(searchTerm) ||
      cycle.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange =
      (!dateFilter.startDate || cycle.runDate >= dateFilter.startDate) &&
      (!dateFilter.endDate || cycle.runDate <= dateFilter.endDate);

    return matchesSearch && matchesDateRange;
  });

  const handleViewReport = (cycle: any) => {
    setSelectedCycle(cycle);
    setIsDetailModalOpen(true);
  };

  const getTotalStats = () => {
    const completed = mockPayrollCycles.filter((c) => c.completed);
    return {
      totalCycles: mockPayrollCycles.length,
      completedCycles: completed.length,
      totalDisbursed: completed.reduce(
        (sum, c) => sum + c.totalDisbursementAmount,
        0
      ),
      totalEmployees: Math.max(
        ...mockPayrollCycles.map((c) => c.employeeCount)
      ),
    };
  };

  const stats = getTotalStats();
  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Payroll Reports</h1>
        <p className="text-muted-foreground">
          View and manage your payroll processing history
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cycles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCycles}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {stats.completedCycles}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Disbursed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-700">
              {formatCurrency(stats.totalDisbursed)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {stats.totalEmployees}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by cycle number or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) =>
                    setDateFilter((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-40"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) =>
                    setDateFilter((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-40"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter({ startDate: "", endDate: "" });
                }}
                className="mt-6"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCycles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No reports found</p>
              <p className="text-muted-foreground">
                {searchTerm || dateFilter.startDate || dateFilter.endDate
                  ? "Try adjusting your search criteria"
                  : "Your payroll reports will appear here once you process payroll"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Run Date</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />#
                        {cycle.cycleCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(cycle.runDate).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {cycle.employeeCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(cycle.totalDisbursementAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cycle.completed
                            ? "default"
                            : cycle.hasRun
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          cycle.completed
                            ? "bg-green-100 text-green-800 border-green-200"
                            : cycle.hasRun
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {cycle.completed && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {cycle.hasRun && !cycle.completed && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {!cycle.hasRun && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {cycle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReport(cycle)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {cycle.hasRun && !cycle.completed && (
                          <Button
                            size="sm"
                            onClick={() => handleViewReport(cycle)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <TrendingUp className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {filteredCycles.some((c) => c.hasRun && !c.completed) && (
        <Alert className="border-blue-200 bg-blue-50">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            You have{" "}
            {filteredCycles.filter((c) => c.hasRun && !c.completed).length}{" "}
            processed payroll cycle(s) awaiting disbursement.
          </AlertDescription>
        </Alert>
      )}

      {/* Report Detail Modal */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cycle={selectedCycle}
      />
    </div>
  );
}
