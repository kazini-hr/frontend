import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-kaziniBlue">
                  Register Your Account
                </h1>
                <p className="text-balance text-kaziniMuted">
                  Enter your details to create an account
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 text-kaziniBlue">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2 text-kaziniBlue">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2 text-kaziniBlue">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="a@kazinihr.com"
                  required
                />
              </div>
              <div className="grid gap-2 text-kaziniBlue">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                />

                <span className="text-sm text-kaziniMuted">
                  Must be at least 8 characters long
                </span>
              </div>
              <Button
                type="submit"
                className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
              >
                Register
              </Button>
              <div className="text-center text-sm text-kaziniBlue">
                Don&apos;t have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
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
