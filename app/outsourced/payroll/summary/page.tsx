"use client";

import React, { useState } from "react";
import {
  usePayrollSummary,
  useProcessPayroll,
  handleApiError,
} from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calculator,
  Users,
  DollarSign,
  Receipt,
  Play,
  AlertCircle,
  Info,
  CheckCircle,
  Building2,
  CreditCard,
} from "lucide-react";

// Process Payroll Confirmation Modal
const ProcessPayrollModal = ({
  isOpen,
  onClose,
  summary,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  summary: any;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Payroll Processing</DialogTitle>
          <DialogDescription>
            This will process payroll for all active employees. Please review
            the summary below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Employees:</span>
                  <span>{summary.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Gross Pay:</span>
                  <span>KES {summary.totalGrossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">PAYE Tax:</span>
                  <span className="text-red-600">
                    KES {summary.totalPayeTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Net Pay:</span>
                  <span className="text-green-600">
                    KES {summary.totalNetPay.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">KaziniHR Fees (2%):</span>
                  <span className="text-blue-600">
                    KES {summary.totalKaziniHRFees.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>
                    KES {summary.totalDisbursementAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This action cannot be undone. Ensure
              all employee data is correct before proceeding.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function PayrollSummaryPage() {
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const { data: summary, isLoading, error } = usePayrollSummary();
  console.log("summary", summary);
  const processPayroll = useProcessPayroll();
  const { toast } = useToast();

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  const handleProcessPayroll = async () => {
    try {
      // @TODO: Add payroll data to run if needed
      await processPayroll.mutateAsync({});

      toast({
        title: "Payroll Processed",
        description:
          "Payroll has been processed successfully. Check reports for details.",
      });

      setIsProcessModalOpen(false);
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load payroll summary. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
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

  if (!summary) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No payroll data available. Please ensure you have active employees
            and proper configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payroll Summary</h1>
          <p className="text-muted-foreground">
            Review payroll calculations before processing
          </p>
        </div>

        <Button
          onClick={() => setIsProcessModalOpen(true)}
          disabled={summary.employeeCount === 0 || processPayroll.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="h-4 w-4 mr-2" />
          {processPayroll.isPending ? "Processing..." : "Process Payroll"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.employeeCount}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(summary.totalGrossPay)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PAYE Tax</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-700">
              {formatCurrency(summary.totalPayeTax)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-700">
              {formatCurrency(summary.totalNetPay)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KaziniHR Fees</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-700">
              {formatCurrency(summary.totalKaziniHRFees)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">2% of net pay</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-700">
              {formatCurrency(summary.totalDisbursementAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KaziniHR Fee Information */}
      <Alert className="border-blue-200 bg-blue-50">
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h4 className="font-semibold">Transaction Fees</h4>
            <p className="text-sm">
              KaziniHR charges 2% of the net pay amount. This fee will be
              automatically collected and sent to:
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <div className="grid gap-1">
                <div>
                  <strong>Bank:</strong> {summary?.kazinihrAccount?.bankName}
                </div>
                <div>
                  <strong>Account:</strong>{" "}
                  {summary?.kazinihrAccount?.accountNumber}
                </div>
                <div>
                  <strong>Name:</strong> {summary?.kazinihrAccount?.accountName}
                </div>
                <div>
                  <strong>Bank Code:</strong>{" "}
                  {summary?.kazinihrAccount?.bankCode}
                </div>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Employee Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.breakdown.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No active employees</p>
              <p className="text-muted-foreground">
                Add employees to see payroll breakdown
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Bank Code</TableHead>
                    <TableHead className="text-right">Gross Pay</TableHead>
                    <TableHead className="text-right">PAYE Tax</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="text-right">KaziniHR Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.breakdown.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell className="font-mono">
                        {employee.accountNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {employee.bankCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(employee.grossPay)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-medium">
                        {formatCurrency(employee.payeTax)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(employee.netPay)}
                      </TableCell>
                      <TableCell className="text-right text-purple-600 font-medium">
                        {formatCurrency(employee.kazinihrFee)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {summary.employeeCount === 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No employees are available for payroll processing. Please add
            employees first.
          </AlertDescription>
        </Alert>
      )}

      {summary.totalDisbursementAmount > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Payroll summary is ready. Total disbursement amount:{" "}
            <strong>{formatCurrency(summary.totalDisbursementAmount)}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Process Payroll Modal */}
      {summary && (
        <ProcessPayrollModal
          isOpen={isProcessModalOpen}
          onClose={() => setIsProcessModalOpen(false)}
          summary={summary}
          onConfirm={handleProcessPayroll}
        />
      )}
    </div>
  );
}
