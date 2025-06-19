"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogin, handleAuthError } from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth-context";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { is } from "date-fns/locale";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Please enter a valid email address"),
  password: z.string().min(1, { message: "Password is required" }),
  company_unique_id: z.string().min(1, { message: "Company ID is required" }),
  two_factor_code: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

type LoginStep = "credentials" | "2fa_code";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<LoginStep>("credentials");
  const [otpValue, setOtpValue] = useState("");
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated, "isAuthenticated in LoginForm");

  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      company_unique_id: "",
      two_factor_code: "",
    },
  });

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/outsourced/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const isLoading = loginMutation.isPending;

  const onCredentialsSubmit = async () => {
    // Validate only the credential fields
    const email = getValues("email");
    const password = getValues("password");
    const companyId = getValues("company_unique_id");

    if (!email || !password || !companyId) {
      if (!email) toast.error("Email is required");
      else if (!password) toast.error("Password is required");
      else if (!companyId) toast.error("Company ID is required");
      return;
    }

    // Validate email format
    const emailSchema = z.string().email();
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Move to 2FA step
    setCurrentStep("2fa_code");
    toast.info("Please enter your 2FA code");
  };

  const onFinalSubmit = async (values: LoginFormValues) => {
    try {
      // Set the OTP value in the form
      setValue("two_factor_code", otpValue);

      const loginData = {
        email: values.email,
        password: values.password,
        company_unique_id: values.company_unique_id,
        two_factor_code: otpValue,
      };

      const response = await loginMutation.mutateAsync(loginData);

      console.log("Login response:", response);

      if (response.requires_2fa_setup) {
        toast.error(
          "2FA setup is required. Please contact your administrator."
        );
      } else if (response.requires_2fa) {
        toast.error("Invalid 2FA code. Please try again.");
        setOtpValue("");
      } else if (response.user) {
        toast.success("Login successful!");
        // After successful login, manually invoke checkAuth to update context
        router.push("/outsourced/dashboard");
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      // Reset OTP on error
      setOtpValue("");
    }
  };

  const goBackToCredentials = () => {
    setCurrentStep("credentials");
    setOtpValue("");
  };

  const handleOtpComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      // Auto-submit when OTP is complete
      const formValues = getValues();
      onFinalSubmit(formValues);
    }
  };

  const renderCredentialsStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-kaziniBlue">Welcome back</h1>
        <p className="text-balance text-kaziniMuted">
          Login to your Kazini HR account
        </p>
      </div>

      <div className="grid gap-2 text-kaziniBlue">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@company.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2 text-kaziniBlue">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="/password-reset"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="********"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="grid gap-2 text-kaziniBlue">
        <Label htmlFor="company_unique_id">Company ID</Label>
        <Input
          id="company_unique_id"
          type="text"
          placeholder="Your company unique ID"
          {...register("company_unique_id")}
        />
        {errors.company_unique_id && (
          <p className="text-sm text-red-500">
            {errors.company_unique_id.message}
          </p>
        )}
      </div>

      <Button
        type="button"
        onClick={onCredentialsSubmit}
        className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
        disabled={isLoading}
      >
        Continue
      </Button>

      <div className="text-center text-sm text-kaziniBlue">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </>
  );

  const renderTwoFactorStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-kaziniBlue">
          Two-Factor Authentication
        </h1>
        <p className="text-balance text-kaziniMuted">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-kaziniMuted">
          Logging in as:{" "}
          <span className="font-medium">{getValues("email")}</span>
        </div>

        <InputOTP
          maxLength={6}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
          onComplete={handleOtpComplete}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <p className="text-xs text-kaziniMuted text-center">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={goBackToCredentials}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            const formValues = getValues();
            onFinalSubmit(formValues);
          }}
          className="flex-1 bg-kaziniBlue hover:bg-kaziniBlueLight"
          disabled={isLoading || otpValue.length !== 6}
        >
          {isLoading ? "Verifying..." : "Login"}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setOtpValue("")}
          className="text-sm text-kaziniMuted hover:text-kaziniBlue underline-offset-2 hover:underline"
          disabled={isLoading}
        >
          Clear code
        </button>
      </div>
    </>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster richColors />
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onFinalSubmit)}>
            <div className="flex flex-col gap-6">
              {currentStep === "credentials" && renderCredentialsStep()}
              {currentStep === "2fa_code" && renderTwoFactorStep()}
            </div>
          </form>
          <div className="relative hidden md:block flex justify-center m-auto">
            <img
              src="/images/kazini-hr-original-colors.png"
              alt="Image"
              className="w-[70%] m-auto"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
