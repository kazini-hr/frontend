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
import {
  useLogin,
  useSetup2FA,
  useVerify2FA,
  handleAuthError,
} from "@/lib/api-hooks";
import { useAuth } from "@/lib/auth-context";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { QrCode, Copy, Check } from "lucide-react";

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

type LoginStep = "credentials" | "2fa_setup" | "2fa_code";

interface TwoFASetupData {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  manual_entry_key: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<LoginStep>("credentials");
  const [otpValue, setOtpValue] = useState("");
  const [twoFASetupData, setTwoFASetupData] = useState<TwoFASetupData | null>(
    null
  );
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCode, setCopiedBackupCode] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();

  const loginMutation = useLogin();
  const setup2FAMutation = useSetup2FA();
  const verify2FAMutation = useVerify2FA();

  const form = useForm<LoginFormValues>({
    // @ts-ignore
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
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const isLoading =
    loginMutation.isPending ||
    setup2FAMutation.isPending ||
    verify2FAMutation.isPending;

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

    try {
      // First attempt to login to check 2FA status
      const response = await loginMutation.mutateAsync({
        email,
        password,
        company_unique_id: companyId,
      });

      if (response.requires_2fa_setup) {
        // User needs to set up 2FA
        toast.info("2FA setup required for first login");
        // Fetch 2FA setup data
        const setupData = await setup2FAMutation.mutateAsync({
          email,
          password,
          company_unique_id: companyId,
        });
        //  @ts-ignore
        setTwoFASetupData(setupData);
        setCurrentStep("2fa_setup");
      } else if (response.requires_2fa) {
        // User already has 2FA set up
        setCurrentStep("2fa_code");
        toast.info("Please enter your 2FA code");
      } else if (response.user) {
        // No 2FA required (should not happen in your flow)
        toast.success("Login successful!");
        router.push("/outsourced/dashboard");
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
    }
  };

  const onVerify2FASetup = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      const credentials = getValues();
      const response = await verify2FAMutation.mutateAsync({
        email: credentials.email,
        password: credentials.password,
        company_unique_id: credentials.company_unique_id,
        token: otpValue,
      });

      if (
        response.message === "2FA enabled successfully. Please log in again."
      ) {
        toast.success("2FA setup complete! Please login again.");
        // Reset form and go back to login credentials
        setCurrentStep("credentials");
        setOtpValue("");
        setTwoFASetupData(null);
        form.reset();
      }
    } catch (error: any) {
      if (error.response?.data?.detail === "Invalid 2FA token") {
        toast.error("Invalid 2FA code. Please try again.");
      } else {
        const errorMessage = handleAuthError(error);
        toast.error(errorMessage);
      }
      setOtpValue("");
    }
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

      if (
        response.user &&
        !response.requires_2fa &&
        !response.requires_2fa_setup
      ) {
        toast.success("Login successful!");
        router.push("/outsourced/dashboard");
      } else if (response.requires_2fa) {
        toast.error("Invalid 2FA code. Please try again.");
        setOtpValue("");
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      setOtpValue("");
    }
  };

  const goBackToCredentials = () => {
    setCurrentStep("credentials");
    setOtpValue("");
    setTwoFASetupData(null);
  };

  const handleOtpComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 6 && currentStep === "2fa_code") {
      // Auto-submit when OTP is complete for login
      const formValues = getValues();
      onFinalSubmit(formValues);
    }
  };

  const copyToClipboard = async (
    text: string,
    type: "secret" | "backup",
    index?: number
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "secret") {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else if (type === "backup" && index !== undefined) {
        setCopiedBackupCode(index);
        setTimeout(() => setCopiedBackupCode(null), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
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
            href="/forgot-password"
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
        {isLoading ? "Checking..." : "Continue"}
      </Button>

      <div className="text-center text-sm text-kaziniBlue">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </>
  );

  const renderTwoFactorSetupStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-kaziniBlue">
          Set Up Two-Factor Authentication
        </h1>
        <p className="text-balance text-kaziniMuted">
          Secure your account with 2FA
        </p>
      </div>

      {twoFASetupData && (
        <div className="space-y-6">
          <div className="text-sm text-kaziniMuted text-center">
            Setting up 2FA for:{" "}
            <span className="font-medium">{getValues("email")}</span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <img
                src={twoFASetupData.qr_code}
                alt="2FA QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-xs text-kaziniMuted text-center">
              Scan this QR code with your authenticator app
            </p>
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <Label className="text-sm">
              Can't scan? Enter this code manually:
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={twoFASetupData.manual_entry_key}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() =>
                  copyToClipboard(twoFASetupData.manual_entry_key, "secret")
                }
              >
                {copiedSecret ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Backup Codes */}
          <div className="space-y-2">
            <Label className="text-sm">Save these backup codes:</Label>
            <div className="grid grid-cols-2 gap-2">
              {twoFASetupData.backup_codes.map((code, index) => (
                <div key={index} className="flex items-center gap-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono">
                    {code}
                  </code>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(code, "backup", index)}
                  >
                    {copiedBackupCode === index ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-500">
              ⚠️ Save these codes! You won't see them again.
            </p>
          </div>

          {/* Verification */}
          <div className="space-y-4">
            <Label className="text-sm">
              Enter code from your app to verify:
            </Label>
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
              onComplete={(value) => setOtpValue(value)}
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
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={goBackToCredentials}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onVerify2FASetup}
              className="flex-1 bg-kaziniBlue hover:bg-kaziniBlueLight"
              disabled={isLoading || otpValue.length !== 6}
            >
              {isLoading ? "Verifying..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      )}
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
          <form
            className="p-6 md:p-8 max-h-[600px] overflow-y-auto"
            onSubmit={handleSubmit(onFinalSubmit)}
          >
            <div className="flex flex-col gap-6">
              {currentStep === "credentials" && renderCredentialsStep()}
              {currentStep === "2fa_setup" && renderTwoFactorSetupStep()}
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
