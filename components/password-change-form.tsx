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

export function PasswordChangeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="oldPassword">Old Password</Label>
                  </div>
                  <Input id="oldPassword" type="password" required />
                </div>

                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="newPassword">New Password</Label>
                  </div>
                  <Input id="newPassword" type="password" required />
                </div>

                <div className="grid gap-2 text-kaziniBlue">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                  </div>
                  <Input id="confirmPassword" type="password" required />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                >
                  Confirm
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
