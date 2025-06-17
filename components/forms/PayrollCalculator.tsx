"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calculator } from "lucide-react";
import { apiClient } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { PayrollCalculation } from "@/types/payroll";

interface PayrollCalculatorProps {
  onCalculationComplete?: (result: PayrollCalculation) => void;
  defaultValues?: Partial<{
    basicSalary: number;
    allowances: number;
    currency: string;
  }>;
}

export function PayrollCalculator({
  onCalculationComplete,
  defaultValues,
}: PayrollCalculatorProps) {
  const [formData, setFormData] = useState({
    basicSalary: defaultValues?.basicSalary || 50000,
    incomePeriod: "monthly" as const,
    currency: defaultValues?.currency || "KES",
    allowances: defaultValues?.allowances || 0,
    includeNhif: true,
    includeNssf: true,
    includeHousingLevy: true,
    isPensionable: true,
    hasDisabilityExemption: false,
  });

  const [result, setResult] = useState<PayrollCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePayroll = async () => {
    setIsLoading(true);
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
      onCalculationComplete?.(calculation);
    } catch (error) {
      console.error("Payroll calculation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Quick PAYE Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="basicSalary">Basic Salary (KES)</Label>
            <Input
              id="basicSalary"
              type="number"
              value={formData.basicSalary}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  basicSalary: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowances">Allowances (KES)</Label>
            <Input
              id="allowances"
              type="number"
              value={formData.allowances}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allowances: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Include NHIF</Label>
          <Switch
            checked={formData.includeNhif}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                includeNhif: checked,
              }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Include NSSF</Label>
          <Switch
            checked={formData.includeNssf}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                includeNssf: checked,
              }))
            }
          />
        </div>

        <Button
          onClick={calculatePayroll}
          disabled={isLoading || !formData.basicSalary}
          className="w-full"
        >
          {isLoading ? "Calculating..." : "Calculate"}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600">Net Salary</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(result.netSalary)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Gross: {formatCurrency(result.grossSalary)} | Deductions:{" "}
                {formatCurrency(result.totalDeductions)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
