"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROLES, ROLES_KEYS } from "@/lib/constants";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { CompanyLocation, Employee, RoleKey } from "@/lib/types";
import { sortByField } from "@/lib/utils";
import { useEmployees } from "@/lib/api-hooks";

const employeeSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    middleName: z
      .string()
      .trim()
      .min(2, "Middle name must be at least 2 characters")
      .optional()
      .or(z.literal("")),
    workEmail: z.string().email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .trim()
      .max(18, "Phone number must be at most 18 characters")
      .optional(),
    internalEmployeeId: z
      .string()
      .trim()
      .max(10, "Internal Employee ID must be at most 10 characters")
      .optional(),
    nationalId: z
      .string()
      .trim()
      .max(15, "National ID must be at most 15 characters")
      .optional(),
    kraPin: z
      .string()
      .trim()
      .max(25, "KRA PIN must be at most 25 characters")
      .optional(),
    shif: z
      .string()
      .trim()
      .max(25, "SHIF must be at most 25 characters")
      .optional(),
    nssf: z
      .string()
      .trim()
      .max(25, "NSSF must be at most 25 characters")
      .optional(),
    role: z.enum(Object.keys(ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
    locationId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role !== ROLES_KEYS.COMPANY_ADMIN && !data.locationId)
        return false;
      return true;
    },
    {
      message: "Location is required for non-admin roles",
      path: ["locationId"],
    }
  );

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EmployeeDetailsForm({
  locations,
  employee,
  closeForm,
  companyId,
}: {
  locations: CompanyLocation[];
  employee: Employee | null;
  closeForm: () => void;
  companyId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEmployee, updateEmployee, updateEmployeeRoles } =
    useEmployees(companyId);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      middleName: employee?.middleName ?? "",
      workEmail: employee?.workEmail ?? "",
      phoneNumber: employee?.phoneNumber ?? "",
      internalEmployeeId: employee?.internalEmployeeId ?? "",
      nationalId: employee?.nationalId ?? "",
      kraPin: employee?.kraPin ?? "",
      shif: employee?.shif ?? "",
      nssf: employee?.nssf ?? "",
      role: (employee?.userProfile.roles[0] as string) ?? ROLES_KEYS.EMPLOYEE,
      locationId: employee?.locationId ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = form;

  const selectedRole = watch("role");

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      const data = {
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, v === "" ? null : v])
        ),
        firstName: values.firstName,
        lastName: values.lastName,
        workEmail: values.workEmail,
        roles: [selectedRole as RoleKey],
      };
      if (employee) {
        await updateEmployeeRoles.mutateAsync({
          id: employee.id,
          role: selectedRole as RoleKey,
          locationId: values.locationId?.length ? values.locationId : null,
        });
        await updateEmployee.mutateAsync({ ...data, id: employee.id });
      } else {
        await addEmployee.mutateAsync(data);
      }
      toast.success("Employee saved successfully");
      closeForm();
    } catch (error) {
      toast.error("Error saving employee details");
      console.error("Error saving employee details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Names */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" type="text" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">
              Middle Name{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>

            <Input id="middleName" type="text" {...register("middleName")} />
            {errors.middleName && (
              <p className="text-red-500 text-sm">
                {errors.middleName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" type="text" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="workEmail">Work Email</Label>
            <Input id="workEmail" type="email" {...register("workEmail")} />
            {errors.workEmail && (
              <p className="text-red-500 text-sm">{errors.workEmail.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input id="phoneNumber" type="text" {...register("phoneNumber")} />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* IDs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="internalEmployeeId">
              Internal Employee ID
              {!employee && (
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              )}
            </Label>
            <Input
              id="internalEmployeeId"
              type="text"
              {...register("internalEmployeeId")}
            />
            {errors.internalEmployeeId && (
              <p className="text-red-500 text-sm">
                {errors.internalEmployeeId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationalId">
              National ID{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input id="nationalId" type="text" {...register("nationalId")} />
            {errors.nationalId && (
              <p className="text-red-500 text-sm">
                {errors.nationalId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="kraPin">
              KRA PIN{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input id="kraPin" type="text" {...register("kraPin")} />
            {errors.kraPin && (
              <p className="text-red-500 text-sm">{errors.kraPin.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shif">
              SHIF{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input id="shif" type="text" {...register("shif")} />
            {errors.shif && (
              <p className="text-red-500 text-sm">{errors.shif.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nssf">
              NSSF{" "}
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input id="nssf" type="text" {...register("nssf")} />
            {errors.nssf && (
              <p className="text-red-500 text-sm">{errors.nssf.message}</p>
            )}
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Location (only for non-admins) */}
        {selectedRole !== ROLES_KEYS.COMPANY_ADMIN && (
          <div className="space-y-2">
            <Label htmlFor="locationId">Location</Label>
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortByField(locations, "name").map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.locationId && (
              <p className="text-red-500 text-sm">
                {errors.locationId.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-6 mt-4">
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
      </div>
    </form>
  );
}
