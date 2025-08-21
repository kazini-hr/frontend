"use client";

import FullLayout from "@/components/layout/full-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCompany } from "@/lib/api-hooks";

import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import CompanyDetailsForm from "@/components/forms/company-details-form";
import { format } from "date-fns";

const CompanyDetailsView = ({
  data,
  openEdit,
}: {
  data: Company;
  openEdit: () => void;
}) => {
  const {
    name,
    company_pin,
    country_of_incorporation,
    date_of_incorporation,
    company_email,
  } = data;

  const fieldMapping = [
    {
      label: "Name",
      value: name,
    },
    {
      label: "KRA PIN",
      value: company_pin,
    },
    {
      label: "Country",
      value: country_of_incorporation,
    },
    {
      label: "Date of Incorporation",
      value: format(new Date(date_of_incorporation), "dd-MM-yyyy"),
    },
    {
      label: "Email",
      value: company_email,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={24} />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldMapping.map((field) => (
              <div className="space-y-2">
                <Label htmlFor={field.label}>{field.label}</Label>
                <div id={field.label}>{field.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-8">
          <Button onClick={openEdit}>Edit</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default function CompanyDetails() {
  const { getCompany } = useCompany();
  const { data, isPending, error } = getCompany;
  const [isEditing, setIsEditing] = useState(false);

  if (isPending) {
    return (
      <FullLayout
        title="Company Details"
        description="Manage your company details"
      >
        <Skeleton className="h-40 w-full" />
      </FullLayout>
    );
  }

  if (!data) {
    return (
      <FullLayout
        title="Company Details"
        description="Manage your company details"
      >
        <p className="text-center text-red-500">Company not found</p>
      </FullLayout>
    );
  }

  return (
    <FullLayout
      title="Company Details"
      description="Manage your company details"
    >
      {isEditing ? (
        <CompanyDetailsForm data={data} closeEdit={() => setIsEditing(false)} />
      ) : (
        <CompanyDetailsView data={data} openEdit={() => setIsEditing(true)} />
      )}
    </FullLayout>
  );
}
