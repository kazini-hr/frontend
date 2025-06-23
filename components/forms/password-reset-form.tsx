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

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Set up form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Here you would typically call your API to send the reset code
    console.log("Reset password for:", data.email);
    // Add API call logic here
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-kaziniBlue">
            Forgot Your Password?
          </CardTitle>
          <CardDescription className="text-kaziniMuted">
            Enter your email below we send you a code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-kaziniBlue">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="a@kazinihr.co.ke"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send code"}
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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
