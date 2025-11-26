"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useCompanyLocations } from "@/lib/api-hooks";
import { CompanyLocation } from "@/lib/types";

const locationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export default function CompanyLocationForm({
  companyId,
  closeForm,
  location,
}: {
  companyId: string;
  closeForm: () => void;
  location: CompanyLocation | null;
}) {
  const { addCompanyLocation, updateCompanyLocation } =
    useCompanyLocations(companyId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || "",
      description: location?.description || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: LocationFormValues) => {
    try {
      setIsSubmitting(true);
      if (location) {
        await updateCompanyLocation.mutateAsync({
          id: location.id,
          name: values.name,
          description: values.description,
        });
      } else {
        await addCompanyLocation.mutateAsync({
          name: values.name,
          description: values.description,
        });
      }
      toast.success(
        location
          ? "Location updated successfully"
          : "Location added successfully"
      );
      closeForm();
    } catch (error) {
      toast.error(
        location ? "Error updating location" : "Error adding location"
      );
      console.error("Error adding location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 size={24} />
          {location ? "Edit Location" : "Add Location"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" type="text" {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={closeForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </form>
  );
}
