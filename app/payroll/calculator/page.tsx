"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Info, Download, Share } from "lucide-react";
import { apiClient } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { PayrollCalculation } from "@/types/payroll";

interface CalculatorFormData {
  basicSalary: number;
  incomePeriod: "monthly" | "annual";
  currency: string;
  allowances: number;
  includeNhif: boolean;
  includeNssf: boolean;
  includeHousingLevy: boolean;
  isPensionable: boolean;
  hasDisabilityExemption: boolean;
}

export default function PayeCalculatorPage() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    basicSalary: 125000,
    incomePeriod: "monthly",
    currency: "KES",
    allowances: 8000,
    includeNhif: true,
    includeNssf: true,
    includeHousingLevy: true,
    isPensionable: true,
    hasDisabilityExemption: false,
  });

  const [result, setResult] = useState<PayrollCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof CalculatorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear previous results when form changes
    if (result) {
      setResult(null);
    }
  };

  const calculatePayroll = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = {
        basic_salary: formData.basicSalary,
        income_period: formData.incomePeriod,
        currency: formData.currency,
        allowances: formData.allowances,
        include_nhif: formData.includeNhif,
        include_nssf: formData.includeNssf,
        include_housing_levy: formData.includeHousingLevy,
        is_pensionable: formData.isPensionable,
        has_disability_exemption: formData.hasDisabilityExemption,
      };

      const calculation = await apiClient.calculatePayroll(params);
      setResult(calculation);
    } catch (err) {
      setError(
        "Failed to calculate payroll. Please check your inputs and try again."
      );
      console.error("Payroll calculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      basicSalary: 125000,
      incomePeriod: "monthly",
      currency: "KES",
      allowances: 8000,
      includeNhif: true,
      includeNssf: true,
      includeHousingLevy: true,
      isPensionable: true,
      hasDisabilityExemption: false,
    });
    setResult(null);
    setError("");
  };

  const exportResults = () => {
    if (!result) return;

    const data = {
      inputs: formData,
      results: result,
      calculatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paye-calculation-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (!result || !navigator.share) return;

    navigator
      .share({
        title: "PAYE Calculation Results",
        text: `Net Salary: ${formatCurrency(
          result.netSalary
        )} (Basic: ${formatCurrency(formData.basicSalary)})`,
        url: window.location.href,
      })
      .catch(console.error);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">PAYE Calculator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate Kenya Pay As You Earn (PAYE) tax, NHIF, NSSF, and Housing
          Levy deductions based on current rates and regulations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
            <CardDescription>
              Enter the employee's salary details to calculate deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Salary */}
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary</Label>
              <div className="flex space-x-2">
                <Input
                  id="basicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) =>
                    handleInputChange(
                      "basicSalary",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter basic salary"
                  className="flex-1"
                />
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Income Period */}
            <div className="space-y-2">
              <Label>Income Period</Label>
              <Select
                value={formData.incomePeriod}
                onValueChange={(value: "monthly" | "annual") =>
                  handleInputChange("incomePeriod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Allowances */}
            <div className="space-y-2">
              <Label htmlFor="allowances">
                Allowances
                <span className="text-sm text-muted-foreground ml-2">
                  (Transport, House, etc.)
                </span>
              </Label>
              <Input
                id="allowances"
                type="number"
                value={formData.allowances}
                onChange={(e) =>
                  handleInputChange(
                    "allowances",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Enter total allowances"
              />
            </div>

            <Separator />

            {/* Deductions Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Deductions & Options</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Include NHIF</Label>
                    <p className="text-xs text-muted-foreground">
                      National Hospital Insurance Fund
                    </p>
                  </div>
                  <Switch
                    checked={formData.includeNhif}
                    onCheckedChange={(checked) =>
                      handleInputChange("includeNhif", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Include NSSF</Label>
                    <p className="text-xs text-muted-foreground">
                      National Social Security Fund
                    </p>
                  </div>
                  <Switch
                    checked={formData.includeNssf}
                    onCheckedChange={(checked) =>
                      handleInputChange("includeNssf", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Housing Levy</Label>
                    <p className="text-xs text-muted-foreground">
                      Affordable Housing Levy
                    </p>
                  </div>
                  <Switch
                    checked={formData.includeHousingLevy}
                    onCheckedChange={(checked) =>
                      handleInputChange("includeHousingLevy", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Pensionable</Label>
                    <p className="text-xs text-muted-foreground">
                      Eligible for pension benefits
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPensionable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPensionable", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between sm:col-span-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">
                      Disability Exemption
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Disability tax exemption
                    </p>
                  </div>
                  <Switch
                    checked={formData.hasDisabilityExemption}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasDisabilityExemption", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={calculatePayroll}
                disabled={isLoading || !formData.basicSalary}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </>
                )}
              </Button>
              <Button outline onClick={resetForm}>
                Reset
              </Button>
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Calculations are based on current Kenya Revenue Authority (KRA)
                rates and may change based on updated tax brackets and
                regulations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>
              {result
                ? "Breakdown of salary and deductions"
                : "Results will appear here after calculation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Net Salary</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(result.netSalary)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {formData.incomePeriod}
                    </Badge>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                    Breakdown
                  </h4>

                  {/* Earnings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Basic Salary</span>
                      <span className="font-mono">
                        {formatCurrency(formData.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Allowances</span>
                      <span className="font-mono">
                        {formatCurrency(formData.allowances)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b bg-blue-50 px-3 rounded">
                      <span className="font-medium">Gross Salary</span>
                      <span className="font-mono font-medium">
                        {formatCurrency(result.grossSalary)}
                      </span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm text-red-600">
                      Deductions
                    </h5>

                    <div className="flex justify-between items-center py-2">
                      <span>PAYE Tax</span>
                      <span className="font-mono text-red-600">
                        -{formatCurrency(result.paye)}
                      </span>
                    </div>

                    {formData.includeNhif && (
                      <div className="flex justify-between items-center py-2">
                        <span>NHIF</span>
                        <span className="font-mono text-red-600">
                          -{formatCurrency(result.nhif)}
                        </span>
                      </div>
                    )}

                    {formData.includeNssf && (
                      <div className="flex justify-between items-center py-2">
                        <span>NSSF</span>
                        <span className="font-mono text-red-600">
                          -{formatCurrency(result.nssf)}
                        </span>
                      </div>
                    )}

                    {formData.includeHousingLevy && (
                      <div className="flex justify-between items-center py-2">
                        <span>Housing Levy</span>
                        <span className="font-mono text-red-600">
                          -{formatCurrency(result.housingLevy)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-t bg-red-50 px-3 rounded">
                      <span className="font-medium">Total Deductions</span>
                      <span className="font-mono font-medium text-red-600">
                        -{formatCurrency(result.totalDeductions)}
                      </span>
                    </div>
                  </div>

                  {/* Final Result */}
                  <div className="flex justify-between items-center py-3 border-2 border-green-200 bg-green-50 px-4 rounded-lg">
                    <span className="font-bold">Net Salary</span>
                    <span className="font-mono font-bold text-green-600 text-lg">
                      {formatCurrency(result.netSalary)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button outline onClick={exportResults} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  {typeof navigator.share === "function" && (
                    <Button outline onClick={shareResults} className="flex-1">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  )}
                </div>

                {/* Tax Efficiency Insights */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">
                    Tax Efficiency Insights
                  </h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Effective Tax Rate:</span>
                      <span className="font-medium">
                        {((result.paye / result.grossSalary) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deduction Rate:</span>
                      <span className="font-medium">
                        {(
                          (result.totalDeductions / result.grossSalary) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Take-home Percentage:</span>
                      <span className="font-medium text-green-600">
                        {(
                          (result.netSalary / result.grossSalary) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Enter salary details and click "Calculate" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tax Information Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">PAYE Tax</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>0 - 24,000:</span>
              <span>10%</span>
            </div>
            <div className="flex justify-between">
              <span>24,001 - 32,333:</span>
              <span>25%</span>
            </div>
            <div className="flex justify-between">
              <span>Above 32,333:</span>
              <span>30%</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Personal Relief:</span>
                <span>KES 2,400</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">NHIF Rates</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Up to 5,999:</span>
              <span>150</span>
            </div>
            <div className="flex justify-between">
              <span>6,000 - 7,999:</span>
              <span>300</span>
            </div>
            <div className="flex justify-between">
              <span>8,000 - 11,999:</span>
              <span>400</span>
            </div>
            <div className="flex justify-between">
              <span>100,000+:</span>
              <span>1,700</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Other Deductions</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>NSSF (Tier I):</span>
              <span>6% (Max 1,080)</span>
            </div>
            <div className="flex justify-between">
              <span>NSSF (Tier II):</span>
              <span>6% (Max 1,320)</span>
            </div>
            <div className="flex justify-between">
              <span>Housing Levy:</span>
              <span>1.5%</span>
            </div>
            <div className="pt-2 border-t text-gray-500">
              <span>Rates effective 2024/2025</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
