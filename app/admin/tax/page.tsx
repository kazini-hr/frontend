"use client";

import React, { useState } from "react";
import {
  useTaxRates,
  useUploadTaxRates,
  useClearTaxCache,
  handleAdminApiError,
} from "@/lib/admin-api-hooks";
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
  Receipt,
  Upload,
  Download,
  RefreshCw,
  Crown,
  AlertCircle,
  CheckCircle,
  FileText,
  Database,
  Trash2,
  Edit,
} from "lucide-react";
import { useAuthStore, isSuperAdmin } from "@/lib/auth";

const taxFileTypes = [
  {
    value: "paye_bands",
    label: "PAYE Tax Bands",
    description: "Tax bands and rates for PAYE calculation",
    format: "CSV",
    example:
      "min_income,max_income,rate,relief\n0,24000,10,2400\n24001,32333,25,8083.25",
  },
  {
    value: "shif_config",
    label: "SHIF Configuration",
    description: "Social Health Insurance Fund configuration",
    format: "JSON",
    example:
      '{"rate": 2.75, "max_contribution": 5000, "min_contribution": 300}',
  },
  {
    value: "nssf_config",
    label: "NSSF Configuration",
    description: "National Social Security Fund configuration",
    format: "JSON",
    example:
      '{"tier1_rate": 6, "tier2_rate": 6, "tier1_limit": 7000, "tier2_limit": 36000}',
  },
  {
    value: "housing_levy",
    label: "Housing Levy",
    description: "Housing Development Levy configuration",
    format: "JSON",
    example: '{"rate": 1.5, "employee_rate": 1.5, "employer_rate": 1.5}',
  },
  {
    value: "personal_relief",
    label: "Personal Relief",
    description: "Personal tax relief amounts",
    format: "JSON",
    example:
      '{"monthly_relief": 2400, "annual_relief": 28800, "insurance_relief_limit": 5000}',
  },
  {
    value: "nhif_rates",
    label: "NHIF Rates (Deprecated)",
    description: "Use SHIF configuration instead",
    format: "CSV",
    example: "min_income,max_income,contribution\n0,5999,150\n6000,7999,300",
  },
];

// Upload Tax Rates Modal
const UploadTaxRatesModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");

  const uploadTaxRates = useUploadTaxRates();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const selectedType = taxFileTypes.find((t) => t.value === fileType);
      const expectedExtension = selectedType?.format.toLowerCase();
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (expectedExtension && fileExtension !== expectedExtension) {
        toast({
          title: "Invalid File Type",
          description: `Please select a ${expectedExtension.toUpperCase()} file for ${
            selectedType?.label
          }.`,
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
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileType) {
      toast({
        title: "Missing Information",
        description: "Please select both file type and file.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadTaxRates.mutateAsync({ fileType, file: selectedFile });
      toast({
        title: "Upload Successful",
        description: "Tax rates have been updated successfully.",
      });
      onClose();
      setSelectedFile(null);
      setFileType("");
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const selectedType = taxFileTypes.find((t) => t.value === fileType);
    if (!selectedType) return;

    const content = selectedType.example;
    const blob = new Blob([content], {
      type: selectedType.format === "CSV" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileType}_template.${selectedType.format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTypeInfo = taxFileTypes.find((t) => t.value === fileType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Tax Rates</DialogTitle>
          <DialogDescription>
            Update tax configuration files for the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fileType">Tax File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax file type" />
              </SelectTrigger>
              <SelectContent>
                {taxFileTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTypeInfo && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {selectedTypeInfo.label} Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge variant="outline">
                    {selectedTypeInfo.format} Format
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs font-semibold">
                    Example Content:
                  </Label>
                  <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                    {selectedTypeInfo.example}
                  </pre>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  disabled={!fileType}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="taxFile">Select File</Label>
            <Input
              id="taxFile"
              type="file"
              accept={selectedTypeInfo?.format === "CSV" ? ".csv" : ".json"}
              onChange={handleFileSelect}
              disabled={!fileType}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {selectedFile.name} selected
              </p>
            )}
          </div>

          {fileType === "nhif_rates" && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Deprecated:</strong> NHIF rates are deprecated. Please
                use SHIF configuration instead.
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
            disabled={!selectedFile || !fileType || uploadTaxRates.isPending}
          >
            {uploadTaxRates.isPending ? "Uploading..." : "Upload Tax Rates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Tax Rates Display Component
const TaxRatesDisplay = ({ rates }: { rates: any }) => {
  if (!rates) return null;

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      {/* PAYE Bands */}
      {rates.paye_bands && (
        <Card>
          <CardHeader>
            <CardTitle>PAYE Tax Bands</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Range</TableHead>
                  <TableHead>Rate (%)</TableHead>
                  <TableHead>Relief</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.paye_bands.map((band: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {formatCurrency(band.min_income)} -{" "}
                      {formatCurrency(band.max_income)}
                    </TableCell>
                    <TableCell>{band.rate}%</TableCell>
                    <TableCell>{formatCurrency(band.relief)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* SHIF Configuration */}
      {rates.shif_config && (
        <Card>
          <CardHeader>
            <CardTitle>SHIF Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {rates.shif_config.rate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Contribution Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(rates.shif_config.min_contribution)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Minimum Contribution
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(rates.shif_config.max_contribution)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Maximum Contribution
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NSSF Configuration */}
      {rates.nssf_config && (
        <Card>
          <CardHeader>
            <CardTitle>NSSF Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Tier 1</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {rates.nssf_config.tier1_rate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Up to {formatCurrency(rates.nssf_config.tier1_limit)}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Tier 2</h4>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {rates.nssf_config.tier2_rate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Up to {formatCurrency(rates.nssf_config.tier2_limit)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Housing Levy */}
      {rates.housing_levy && (
        <Card>
          <CardHeader>
            <CardTitle>Housing Development Levy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {rates.housing_levy.employee_rate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Employee Contribution
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {rates.housing_levy.employer_rate}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Employer Contribution
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Relief */}
      {rates.personal_relief && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Relief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(rates.personal_relief.monthly_relief)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Monthly Relief
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(rates.personal_relief.annual_relief)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Annual Relief
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {formatCurrency(rates.personal_relief.insurance_relief_limit)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Insurance Relief Limit
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function TaxAdministrationPage() {
  const { user } = useAuthStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: taxRates, isLoading, error, refetch } = useTaxRates();
  const clearCache = useClearTaxCache();
  const { toast } = useToast();

  // Check if user is super admin
  if (!isSuperAdmin(user)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <Crown className="h-4 w-4" />
          <AlertDescription>
            Only Super Admins can access tax administration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleClearCache = async () => {
    try {
      await clearCache.mutateAsync();
      toast({
        title: "Cache Cleared",
        description: "Tax rates cache has been cleared successfully.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Clear Cache Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{handleAdminApiError(error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="h-8 w-8 text-purple-600" />
            Tax Administration
          </h1>
          <p className="text-muted-foreground">
            Manage tax rates and configuration for the entire system
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClearCache}
            disabled={clearCache.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Tax Rates
          </Button>
        </div>
      </div>

      {/* Tax Configuration Status */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {taxFileTypes.map((type) => {
                const hasConfig = taxRates && taxRates[type.value];
                return (
                  <div key={type.value} className="flex items-center gap-2">
                    {hasConfig ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">{type.label}</span>
                    <Badge
                      variant={hasConfig ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {hasConfig ? "Configured" : "Missing"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Rates Display */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : taxRates ? (
        <TaxRatesDisplay rates={taxRates} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No Tax Configuration Found</p>
              <p className="text-muted-foreground">
                Upload tax rate files to configure the system
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                Tax rate changes affect all payroll calculations system-wide
              </li>
              <li>Always clear cache after uploading new tax configurations</li>
              <li>
                NHIF rates are deprecated - use SHIF configuration instead
              </li>
              <li>Backup existing configurations before making changes</li>
              <li>Test calculations in a development environment first</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Upload Modal */}
      <UploadTaxRatesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
