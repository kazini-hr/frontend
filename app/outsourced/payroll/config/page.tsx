"use client";

import React, { useState, useEffect } from "react";
import {
  usePayrollConfig,
  useCreatePayrollConfig,
  handleApiError,
  useWallet,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  Calendar,
  Clock,
  Wallet,
  CheckCircle,
  AlertCircle,
  Info,
  Edit,
} from "lucide-react";
import type { PayrollOutsourcedConfiguration } from "@/lib/types";

interface ConfigFormData {
  payrollPeriod: "MONTHLY" | "WEEKLY" | "BIWEEKLY";
  startDate: string;
  endDate: string;
  dayOfPayment: string;
  walletId: string;
}

const PayrollConfigurationForm = ({
  config,
  onSuccess,
}: {
  config?: PayrollOutsourcedConfiguration;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<ConfigFormData>({
    payrollPeriod: config?.payrollPeriod || "MONTHLY",
    startDate: config?.startDate?.split("T")[0] || "",
    endDate: config?.endDate?.split("T")[0] || "",
    dayOfPayment: config?.dayOfPayment?.toString() || "30",
    walletId: config?.walletId || "",
  });

  const createConfig = useCreatePayrollConfig();
  const { toast } = useToast();

  const { data: wallets } = useWallet();

  console.log("Wallets:", wallets);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        payrollPeriod: formData.payrollPeriod,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        dayOfPayment: parseInt(formData.dayOfPayment),
        walletId: formData.walletId ?? "",
        isActive: true,
      };

      console.log(
        "conf data: ",
        new Date(formData.startDate).toISOString(),
        typeof data.startDate
      );

      await createConfig.mutateAsync(data);

      toast({
        title: "Configuration Saved",
        description: "Payroll configuration has been updated successfully.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: handleApiError(error),
        variant: "destructive",
      });
    }
  };

  const getPeriodDescription = (period: string) => {
    switch (period) {
      case "MONTHLY":
        return "Payroll will be processed once per month";
      case "WEEKLY":
        return "Payroll will be processed every week";
      case "BIWEEKLY":
        return "Payroll will be processed every two weeks";
      default:
        return "";
    }
  };

  const getNextPayrollDate = () => {
    if (!formData.startDate || !formData.dayOfPayment) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const payDay = parseInt(formData.dayOfPayment);

    let nextPayroll = new Date(currentYear, currentMonth, payDay);

    if (nextPayroll <= today) {
      nextPayroll = new Date(currentYear, currentMonth + 1, payDay);
    }

    return nextPayroll.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payroll Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payrollPeriod">Payroll Period</Label>
              <Select
                value={formData.payrollPeriod}
                onValueChange={(value: "MONTHLY" | "WEEKLY" | "BIWEEKLY") =>
                  setFormData((prev) => ({ ...prev, payrollPeriod: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getPeriodDescription(formData.payrollPeriod)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayOfPayment">Day of Payment</Label>
              <Select
                value={formData.dayOfPayment}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, dayOfPayment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day === 31
                        ? "Last day of month"
                        : `${day}${getOrdinalSuffix(day)} of month`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                min={formData.startDate}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for ongoing payroll
              </p>
            </div>
          </div>

          {getNextPayrollDate() && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Next Payroll:</strong> {getNextPayrollDate()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={createConfig.isPending}>
          {createConfig.isPending
            ? "Saving..."
            : config
            ? "Update Configuration"
            : "Create Configuration"}
        </Button>
      </div>
    </form>
  );
};

// Helper function for ordinal numbers
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default function PayrollConfigPage() {
  const { data: config, isLoading, error, refetch } = usePayrollConfig();
  const [isEditing, setIsEditing] = useState(false);

  // If no config exists, show form immediately
  useEffect(() => {
    if (!isLoading && !config && !error) {
      setIsEditing(true);
    }
  }, [isLoading, config, error]);

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load payroll configuration. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Payroll Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure your outsourced payroll schedule and settings
          </p>
        </div>

        {config && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Configuration
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : isEditing || !config ? (
        <PayrollConfigurationForm config={config} onSuccess={handleSuccess} />
      ) : (
        /* Display Current Configuration */
        <div className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your payroll configuration is active and ready for processing.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Payroll Period
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-sm">
                        {config.payrollPeriod}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Payment Day
                    </Label>
                    <p className="text-lg font-medium mt-1">
                      {config.dayOfPayment === 31
                        ? "Last day of month"
                        : `${config.dayOfPayment}${getOrdinalSuffix(
                            config.dayOfPayment
                          )} of month`}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={config.isActive ? "default" : "secondary"}
                      >
                        {config.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </Label>
                    <p className="text-lg font-medium mt-1">
                      {new Date(config.startDate).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {config.endDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        End Date
                      </Label>
                      <p className="text-lg font-medium mt-1">
                        {new Date(config.endDate).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Wallet ID
                    </Label>
                    <p className="text-lg font-medium mt-1 font-mono text-sm bg-muted px-2 py-1 rounded">
                      {config.walletId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(config.createdAt).toLocaleDateString("en-KE")}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(config.updatedAt).toLocaleDateString("en-KE")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!config && !isEditing && !isLoading && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No payroll configuration found. Create one to start processing
            payroll.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
