"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Company } from "@/lib/types";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUNTRIES } from "@/lib/constants";
import { useCompany } from "@/lib/api-hooks";
import { useState } from "react";
import { toast } from "sonner";

const companySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  company_pin: z
    .string()
    .min(10, "KRA PIN must be at least 10 characters")
    .max(25, "KRA PIN must be at most 25 characters"),
  country_of_incorporation: z.enum(
    Object.values(COUNTRIES) as [string, ...string[]],
    {
      required_error: "Country is required",
    }
  ),
  date_of_incorporation: z.string().min(1, "Date of Incorporation is required"),
  company_email: z
    .string()
    .max(254, "Email must be at most 254 characters")
    .email({ message: "Please enter a valid email address" }),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyDetailsForm({
  data,
  closeEdit,
}: {
  data: Company;
  closeEdit: () => void;
}) {
  const { updateCompany } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: data?.name ?? "",
      company_pin: data?.company_pin ?? "",
      country_of_incorporation: data?.country_of_incorporation ?? "",
      date_of_incorporation: data?.date_of_incorporation
        ? new Date(data.date_of_incorporation).toISOString().split("T")[0]
        : "",
      company_email: data?.company_email ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        date_of_incorporation: new Date(
          values.date_of_incorporation
        ).toISOString(),
        id: data.id,
      };
      await updateCompany.mutateAsync(payload);
      toast.success("Company updated successfully");
      closeEdit();
    } catch (error) {
      toast.error("Error updating company details");
      console.error("Error updating company details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={24} />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_pin">KRA PIN</Label>
              <Input
                id="company_pin"
                type="text"
                {...register("company_pin")}
              />
              {errors.company_pin && (
                <p className="text-red-500 text-sm">
                  {errors.company_pin.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country_of_incorporation">Country</Label>
              <Controller
                name="country_of_incorporation"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(COUNTRIES).map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country_of_incorporation && (
                <p className="text-red-500 text-sm">
                  {errors.country_of_incorporation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_incorporation">
                Date of Incorporation
              </Label>
              <Input
                id="date_of_incorporation"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("date_of_incorporation")}
              />
              {errors.date_of_incorporation && (
                <p className="text-red-500 text-sm">
                  {errors.date_of_incorporation.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_email">Company Email</Label>
            <Input
              id="company_email"
              type="email"
              {...register("company_email")}
            />
            {errors.company_email && (
              <p className="text-red-500 text-sm">
                {errors.company_email.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-8">
          <Button
            type="button"
            variant="outline"
            onClick={closeEdit}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
