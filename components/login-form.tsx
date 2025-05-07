"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/actions/auth";
import useFetch from "@/hooks/use-fetch";
import { Toaster } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "This field has to be filled.",
    })
    .email("This is not a valid email."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data, loading, error, fn: doLogin } = useFetch(login);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: LoginFormValues) => {
    await doLogin(values);
  };

  console.log("Login response:", data);
  console.log("Login loading:", loading);
  console.log("Login error:", error);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster richColors />
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-kaziniBlue">
                  Welcome back
                </h1>
                <p className="text-balance text-kaziniMuted">
                  Login to your Kazini HR account
                </p>
              </div>
              <div className="grid gap-2 text-kaziniBlue">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="a@kazinihr.com"
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
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm text-kaziniBlue">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
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
