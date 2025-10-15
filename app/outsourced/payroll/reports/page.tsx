"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  usePayrollCycleReport,
  usePayrollCycles,
  useDisbursePayroll,
} from "@/lib/api-hooks";
import api from "@/lib/api";

// Individual Report Modal
const ReportDetailModal = ({
  isOpen,
  onClose,
  cycle,
  reportData,
}: {
  isOpen: boolean;
  onClose: () => void;
  cycle: any;
  reportData: any;
}) => {
  const { toast } = useToast();
  const [isDisburseLoading, setIsDisburseLoading] = useState(false);

  // Initialize the disburse payroll mutation
  const { mutateAsync: disbursePayroll } = useDisbursePayroll();

  const downloadReport = (format: "pdf" | "excel") => {
    toast({
      title: "Download Started",
      description: `Generating ${format.toUpperCase()} report for Cycle #${
        cycle.cycleCount
      }`,
    });
  };

  const handleDisburse = async () => {
    if (!cycle || !cycle.id) return;

    setIsDisburseLoading(true);

    try {
      await disbursePayroll(cycle.id);

      toast({
        title: "Disbursement Successful",
        description: "Payments have been processed via SasaPay",
        variant: "default",
      });

      onClose();
    } catch (error) {
      console.error("Disbursement error:", error);
      toast({
        title: "Disbursement Failed",
        description:
          "There was a problem processing the payments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDisburseLoading(false);
    }
  };

  if (!cycle) return null;

  // Use data from the report if available, fallback to mock values
  const totalGrossPay = reportData?.totalGrossPay || 0;
  const totalNetPay = reportData?.totalNetPay || 0;
  const totalPayeTax = reportData?.totalPayeTax || 0;
  const totalKaziniHRFees = totalNetPay * 0.02; // 2% of net pay as fees
  const totalTransactionFees = 100; // Fixed transaction fee per cycle
  const totalDisbursementAmount = totalNetPay + totalTransactionFees;
  const employeeCount = reportData?.employeeCount || 0;
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
                  {employeeCount}
                </div>
                <div className="text-xs text-muted-foreground">Employees</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(totalGrossPay)}
                </div>
                <div className="text-xs text-muted-foreground">Gross Pay</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(totalPayeTax)}
                </div>
                <div className="text-xs text-muted-foreground">PAYE Tax</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(totalTransactionFees)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Transaction Fees
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
                {cycle.completed
                  ? "COMPLETED"
                  : cycle.hasRun
                  ? "PROCESSED"
                  : "PENDING"}
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
                <Button
                  size="sm"
                  onClick={handleDisburse}
                  disabled={isDisburseLoading}
                >
                  {isDisburseLoading ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Disburse Now
                    </>
                  )}
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
                    {formatCurrency(totalGrossPay)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    PAYE Tax Deducted
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    -{formatCurrency(totalPayeTax)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Net Pay to Employees
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatCurrency(totalNetPay)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Transaction Fees (KES 100 per transaction)
                  </TableCell>
                  <TableCell className="text-right text-purple-600">
                    {formatCurrency(totalTransactionFees)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t font-bold">
                  <TableCell>Total Disbursement Amount</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totalDisbursementAmount)}
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
  const [cycleReports, setCycleReports] = useState<Record<string, any>>({});
  const [loadingReports, setLoadingReports] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Fetch the actual payroll cycles from your API
  const { data: payrollCycles, isLoading } = usePayrollCycles();

  // Fetch the report for the selected cycle
  const { data: payrollCycleReport } = usePayrollCycleReport(selectedCycle?.id);

  const { toast } = useToast();

  // Function to fetch report data for a cycle using API
  const fetchReportForCycle = useCallback(
    async (cycleId: string) => {
      if (cycleReports[cycleId]) {
        // We already have this report data
        return cycleReports[cycleId];
      }

      setLoadingReports((prev) => ({ ...prev, [cycleId]: true }));

      try {
        // Use the axios api instance instead of fetch
        const { data } = await api.get(
          `/api/outsourced/payroll/reports/${cycleId}`
        );

        setCycleReports((prev) => ({ ...prev, [cycleId]: data }));
        return data;
      } catch (error) {
        console.error("Error fetching report:", error);
        toast({
          variant: "destructive",
          title: "Failed to load report data",
          description:
            "There was a problem loading the payroll report details.",
        });
        return null;
      } finally {
        setLoadingReports((prev) => ({ ...prev, [cycleId]: false }));
      }
    },
    [cycleReports, toast]
  );

  // Batch fetch reports for all cycles when component loads
  useEffect(() => {
    const loadAllCycleReports = async () => {
      if (!payrollCycles || isInitialLoadComplete) return;

      // Don't try to load if we have no cycles
      if (payrollCycles.length === 0) {
        setIsInitialLoadComplete(true);
        return;
      }

      try {
        // Load up to 5 most recent cycles initially to avoid too many simultaneous requests
        const cyclesToFetch = payrollCycles.slice(0, 5);

        // Set loading states for all cycles
        const loadingStates: Record<string, boolean> = {};
        cyclesToFetch.forEach((cycle: any) => {
          loadingStates[cycle.id] = true;
        });
        setLoadingReports((prev) => ({ ...prev, ...loadingStates }));

        // Fetch reports in parallel
        const reportPromises = cyclesToFetch.map((cycle: any) =>
          fetchReportForCycle(cycle.id).catch((error) => {
            console.error(
              `Error fetching report for cycle ${cycle.id}:`,
              error
            );
            return null;
          })
        );

        await Promise.all(reportPromises);
      } catch (error) {
        console.error("Error loading initial reports:", error);
        toast({
          title: "Warning",
          description:
            "Some report data could not be loaded. Details may be incomplete.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoadComplete(true);
      }
    };

    loadAllCycleReports();
  }, [payrollCycles, isInitialLoadComplete, fetchReportForCycle, toast]);

  // When report data is received, store it for the selected cycle
  useEffect(() => {
    if (selectedCycle && payrollCycleReport) {
      setCycleReports((prev) => ({
        ...prev,
        [selectedCycle.id]: payrollCycleReport,
      }));
      setSelectedReport(payrollCycleReport);
    }
  }, [payrollCycleReport, selectedCycle]);

  const handleViewReport = async (cycle: any) => {
    setSelectedCycle(cycle);
    setIsDetailModalOpen(true);

    // If we don't have report data yet, fetch it
    if (!cycleReports[cycle.id]) {
      await fetchReportForCycle(cycle.id);
    }
  };

  // Filter payroll cycles based on search and date filters
  const filteredCycles = payrollCycles
    ? payrollCycles.filter((cycle: any) => {
        const matchesSearch =
          cycle.cycleCount.toString().includes(searchTerm) ||
          (cycle.completed
            ? "COMPLETED"
            : cycle.hasRun
            ? "PROCESSED"
            : "PENDING"
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const cycleRunDate = new Date(cycle.runDate)
          .toISOString()
          .split("T")[0];
        const matchesDateRange =
          (!dateFilter.startDate || cycleRunDate >= dateFilter.startDate) &&
          (!dateFilter.endDate || cycleRunDate <= dateFilter.endDate);

        return matchesSearch && matchesDateRange;
      })
    : [];

  console.log("Filtered Cycles:", filteredCycles);

  // Calculate summary statistics
  const getTotalStats = () => {
    if (!payrollCycles)
      return {
        totalCycles: 0,
        completedCycles: 0,
        totalDisbursed: 0,
        totalEmployees: 0,
      };

    const completed = payrollCycles.filter((c: any) => c.completed);

    // Calculate totals from available report data
    let totalDisbursed = 0;
    let maxEmployees = 0;

    Object.values(cycleReports).forEach((report: any) => {
      if (report) {
        const netPay = report.totalNetPay || 0;
        const fees = netPay * 0.02; // 2% fees
        const transactionFees = 100; // Fixed transaction fee
        totalDisbursed += netPay + transactionFees;

        if (report.employeeCount > maxEmployees) {
          maxEmployees = report.employeeCount;
        }
      }
    });

    return {
      totalCycles: payrollCycles.length,
      completedCycles: completed.length,
      totalDisbursed,
      totalEmployees: maxEmployees,
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
          <CardTitle>
            Payroll History
            {!isInitialLoadComplete && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Loading...)
              </span>
            )}
          </CardTitle>
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
                {filteredCycles.map((cycle: any) => {
                  // Get report data if available
                  const report = cycleReports[cycle.id];
                  const isLoading = loadingReports[cycle.id];
                  const employeeCount = report ? report.employeeCount : 0;
                  const netPay = report ? report.totalNetPay : 0;
                  const fees = netPay * 0.02; // 2% fees
                  const transactionFees = 100; // Fixed transaction fee
                  const totalAmount = netPay + transactionFees;

                  return (
                    <TableRow key={cycle.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          #{cycle.cycleCount}
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
                          {isLoading ? (
                            <Skeleton className="h-4 w-8" />
                          ) : (
                            employeeCount
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {isLoading ? (
                          <Skeleton className="h-4 w-20 ml-auto" />
                        ) : (
                          formatCurrency(totalAmount)
                        )}
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
                          {cycle.completed
                            ? "COMPLETED"
                            : cycle.hasRun
                            ? "PROCESSED"
                            : "PENDING"}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {filteredCycles.some((c: any) => c.hasRun && !c.completed) && (
        <Alert className="border-blue-200 bg-blue-50">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            You have{" "}
            {filteredCycles.filter((c: any) => c.hasRun && !c.completed).length}{" "}
            processed payroll cycle(s) awaiting disbursement.
          </AlertDescription>
        </Alert>
      )}

      {/* Report Detail Modal */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cycle={selectedCycle}
        reportData={selectedCycle ? cycleReports[selectedCycle.id] : null}
      />
    </div>
  );
}
