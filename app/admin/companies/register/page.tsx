"use client";

import React from "react";
import { useCreateCompany, handleAdminApiError } from "@/lib/admin-api-hooks";
import { useFormValidation } from "@/lib/form-utils";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  User,
  MapPin,
  Crown,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, isSuperAdmin } from "@/lib/auth";
import { Textarea } from "@/components/ui/textarea";

interface CompanyRegistrationForm {
  // Company Details
  name: string;
  company_pin: string;
  kra_pin: string;
  industry: string;
  size: string;

  // Admin User Details
  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;

  // Address Details
  street: string;
  city: string;
  postal_code: string;
  county: string;
  country: string;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Construction",
  "Education",
  "Agriculture",
  "Transportation",
  "Real Estate",
  "Hospitality",
  "Media",
  "Energy",
  "Telecommunications",
  "Other",
];

const companySizes = [
  { value: "SMALL", label: "Small (1-50 employees)" },
  { value: "MEDIUM", label: "Medium (51-250 employees)" },
  { value: "LARGE", label: "Large (251-1000 employees)" },
  { value: "ENTERPRISE", label: "Enterprise (1000+ employees)" },
];

const counties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Machakos",
  "Meru",
  "Nyeri",
  "Thika",
  "Garissa",
  "Kakamega",
  "Malindi",
  "Kitale",
  "Kericho",
  "Naivasha",
  "Voi",
];

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  company_pin: {
    required: true,
    pattern: /^P\d{9}[A-Z]$/,
    custom: (value: string) => {
      if (value && !value.match(/^P\d{9}[A-Z]$/)) {
        return "Company PIN must be in format P123456789X";
      }
      return null;
    },
  },
  kra_pin: {
    required: true,
    pattern: /^[A-Z]\d{9}[A-Z]$/,
    custom: (value: string) => {
      if (value && !value.match(/^[A-Z]\d{9}[A-Z]$/)) {
        return "KRA PIN must be in format A123456789X";
      }
      return null;
    },
  },
  industry: {
    required: true,
  },
  size: {
    required: true,
  },
  admin_email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Please enter a valid email address";
      }
      return null;
    },
  },
  admin_first_name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  admin_last_name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  street: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  postal_code: {
    required: true,
    pattern: /^\d{5}$/,
    custom: (value: string) => {
      if (value && !value.match(/^\d{5}$/)) {
        return "Postal code must be 5 digits";
      }
      return null;
    },
  },
  county: {
    required: true,
  },
  country: {
    required: true,
  },
};

export default function CompanyRegistrationPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is super admin
  if (!isSuperAdmin(user)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <Crown className="h-4 w-4" />
          <AlertDescription>
            Only Super Admins can register new companies.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const initialValues: CompanyRegistrationForm = {
    name: "",
    company_pin: "",
    kra_pin: "",
    industry: "",
    size: "",
    admin_email: "",
    admin_first_name: "",
    admin_last_name: "",
    street: "",
    city: "",
    postal_code: "",
    county: "",
    country: "Kenya",
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
  } = useFormValidation(initialValues, validationRules);

  const createCompany = useCreateCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: values.name,
        company_pin: values.company_pin,
        kra_pin: values.kra_pin,
        industry: values.industry,
        size: values.size,
        admin_email: values.admin_email,
        admin_first_name: values.admin_first_name,
        admin_last_name: values.admin_last_name,
        address: {
          street: values.street,
          city: values.city,
          postal_code: values.postal_code,
          county: values.county,
          country: values.country,
        },
      };

      await createCompany.mutateAsync(payload);

      toast({
        title: "Company Registered Successfully",
        description: "Welcome emails have been sent to the admin user.",
      });

      reset();
      router.push("/admin/companies");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  const getFieldError = (fieldName: keyof CompanyRegistrationForm) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : null;
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/companies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="h-8 w-8 text-purple-600" />
            Register New Company
          </h1>
          <p className="text-muted-foreground">
            Register a new company and create admin user account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Acme Corporation Ltd"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={getFieldError("name") ? "border-red-500" : ""}
                />
                {getFieldError("name") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.industry}
                  onValueChange={(value) => handleChange("industry", value)}
                >
                  <SelectTrigger
                    className={
                      getFieldError("industry") ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("industry") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("industry")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="company_pin">
                  Company PIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_pin"
                  placeholder="P123456789X"
                  value={values.company_pin}
                  onChange={(e) =>
                    handleChange("company_pin", e.target.value.toUpperCase())
                  }
                  onBlur={() => handleBlur("company_pin")}
                  className={
                    getFieldError("company_pin") ? "border-red-500" : ""
                  }
                />
                {getFieldError("company_pin") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("company_pin")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kra_pin">
                  KRA PIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kra_pin"
                  placeholder="A123456789X"
                  value={values.kra_pin}
                  onChange={(e) =>
                    handleChange("kra_pin", e.target.value.toUpperCase())
                  }
                  onBlur={() => handleBlur("kra_pin")}
                  className={getFieldError("kra_pin") ? "border-red-500" : ""}
                />
                {getFieldError("kra_pin") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("kra_pin")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">
                  Company Size <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.size}
                  onValueChange={(value) => handleChange("size", value)}
                >
                  <SelectTrigger
                    className={getFieldError("size") ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("size") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("size")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin User Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="admin_first_name">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin_first_name"
                  placeholder="John"
                  value={values.admin_first_name}
                  onChange={(e) =>
                    handleChange("admin_first_name", e.target.value)
                  }
                  onBlur={() => handleBlur("admin_first_name")}
                  className={
                    getFieldError("admin_first_name") ? "border-red-500" : ""
                  }
                />
                {getFieldError("admin_first_name") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("admin_first_name")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_last_name">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin_last_name"
                  placeholder="Doe"
                  value={values.admin_last_name}
                  onChange={(e) =>
                    handleChange("admin_last_name", e.target.value)
                  }
                  onBlur={() => handleBlur("admin_last_name")}
                  className={
                    getFieldError("admin_last_name") ? "border-red-500" : ""
                  }
                />
                {getFieldError("admin_last_name") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("admin_last_name")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin_email"
                  type="email"
                  placeholder="admin@company.com"
                  value={values.admin_email}
                  onChange={(e) => handleChange("admin_email", e.target.value)}
                  onBlur={() => handleBlur("admin_email")}
                  className={
                    getFieldError("admin_email") ? "border-red-500" : ""
                  }
                />
                {getFieldError("admin_email") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("admin_email")}
                  </p>
                )}
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                A welcome email with login credentials will be sent to this
                admin user.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Company Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="street"
                placeholder="123 Main Street, Building Name, Floor"
                value={values.street}
                onChange={(e) => handleChange("street", e.target.value)}
                onBlur={() => handleBlur("street")}
                className={getFieldError("street") ? "border-red-500" : ""}
                rows={2}
              />
              {getFieldError("street") && (
                <p className="text-sm text-red-500">
                  {getFieldError("street")}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Nairobi"
                  value={values.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  className={getFieldError("city") ? "border-red-500" : ""}
                />
                {getFieldError("city") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("city")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">
                  County <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.county}
                  onValueChange={(value) => handleChange("county", value)}
                >
                  <SelectTrigger
                    className={getFieldError("county") ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("county") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("county")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">
                  Postal Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postal_code"
                  placeholder="00100"
                  value={values.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  onBlur={() => handleBlur("postal_code")}
                  className={
                    getFieldError("postal_code") ? "border-red-500" : ""
                  }
                />
                {getFieldError("postal_code") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("postal_code")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  value={values.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  onBlur={() => handleBlur("country")}
                  className={getFieldError("country") ? "border-red-500" : ""}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createCompany.isPending}
            className="min-w-[120px]"
          >
            {createCompany.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Registering...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Register Company
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Company account will be created in the system</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>
                Admin user account will be generated with temporary password
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Welcome email with login instructions will be sent</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Company wallets will be automatically created</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Admin can immediately start adding employees</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>
                Ensure all company details are accurate before submitting
              </span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Company PIN and KRA PIN must be valid and unique</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Admin email must be accessible for login credentials</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>
                Registration cannot be undone - contact support for changes
              </span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Company will start with a trial subscription period</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
