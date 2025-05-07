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

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-kaziniBlue">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="a@kazinihr.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                >
                  Send code
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
