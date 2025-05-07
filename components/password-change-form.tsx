"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Define the form schema using Zod
const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export function PasswordChangeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordChangeFormValues) {
    setIsSubmitting(true);
    try {
      // Handle form submission logic here
      console.log("Form data:", data);
      // Example API call would go here
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-kaziniBlue">
            Change Your Password
          </CardTitle>
          <CardDescription className="text-kaziniMuted">
            Enter your details below to update your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="oldPassword">Old Password</Label>
                  </div>
                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="********"
                    {...form.register("oldPassword")}
                  />
                  {form.formState.errors.oldPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="newPassword">New Password</Label>
                  </div>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="********"
                    {...form.register("newPassword")}
                  />
                  {form.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm"}
                </Button>
              </div>
              <div className="text-center text-sm text-kaziniBlue">
                Remember your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
