"use client";

import FullLayout from "@/components/layout/full-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany, useCompanyLocations } from "@/lib/api-hooks";
import { useState } from "react";
import CompanyLocationsTable from "./table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CompanyLocationForm from "@/components/forms/company-location-form";
import { CompanyLocation } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function CompanyLocations() {
  const { getCompany } = useCompany();
  const { data: companyData, isPending: isCompanyPending } = getCompany;
  const { getCompanyLocations } = useCompanyLocations(companyData?.id || "");
  const [showForm, setShowForm] = useState(false);

  const { data: companyLocations, isPending: isLocationsPending } =
    getCompanyLocations;

  const [selectedLocation, setSelectedLocation] =
    useState<CompanyLocation | null>(null);

  const handleEditLocation = (location: CompanyLocation) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  if (isCompanyPending || isLocationsPending) {
    return (
      <FullLayout
        title="Company Locations"
        description="Manage your company locations"
      >
        <Skeleton className="h-40 w-full" />
      </FullLayout>
    );
  }

  return (
    <FullLayout
      title="Company Locations"
      description="Manage your company locations"
    >
      <Dialog open={showForm} onOpenChange={handleClose}>
        <DialogContent>
          <CompanyLocationForm
            companyId={companyData?.id || ""}
            closeForm={handleClose}
            location={selectedLocation}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className=" flex-row items-center justify-between">
          <CardTitle>Locations</CardTitle>
          <Button onClick={handleAddLocation}>Add Location</Button>
        </CardHeader>
        <CardContent>
          {companyLocations?.length === 0 ? (
            <p>No locations yet</p>
          ) : (
            <CompanyLocationsTable
              data={companyLocations || []}
              editButtonAction={handleEditLocation}
            />
          )}
        </CardContent>
      </Card>
    </FullLayout>
  );
}
