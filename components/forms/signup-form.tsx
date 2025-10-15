"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterCompany, handleAuthError } from "@/lib/api-hooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

// Country options (you can expand this list)
const COUNTRIES = [
  "AFGHANISTAN",
  "ALBANIA",
  "ALGERIA",
  "ARGENTINA",
  "AUSTRALIA",
  "AUSTRIA",
  "BANGLADESH",
  "BELGIUM",
  "BRAZIL",
  "CANADA",
  "CHINA",
  "COLOMBIA",
  "DENMARK",
  "EGYPT",
  "FINLAND",
  "FRANCE",
  "GERMANY",
  "GHANA",
  "GREECE",
  "INDIA",
  "INDONESIA",
  "IRAN",
  "IRAQ",
  "IRELAND",
  "ISRAEL",
  "ITALY",
  "JAPAN",
  "JORDAN",
  "KENYA",
  "KOREA",
  "LEBANON",
  "MALAYSIA",
  "MEXICO",
  "MOROCCO",
  "NETHERLANDS",
  "NEW_ZEALAND",
  "NIGERIA",
  "NORWAY",
  "PAKISTAN",
  "PERU",
  "PHILIPPINES",
  "POLAND",
  "PORTUGAL",
  "ROMANIA",
  "RUSSIA",
  "SAUDI_ARABIA",
  "SINGAPORE",
  "SOUTH_AFRICA",
  "SPAIN",
  "SRI_LANKA",
  "SWEDEN",
  "SWITZERLAND",
  "THAILAND",
  "TURKEY",
  "UGANDA",
  "UKRAINE",
  "UNITED_ARAB_EMIRATES",
  "UNITED_KINGDOM",
  "UNITED_STATES",
  "VENEZUELA",
  "VIETNAM",
  "ZIMBABWE",
];

// Define form schema with Zod
const signupFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  company_alias: z
    .string()
    .min(2, "Company alias must be at least 2 characters"),
  country_of_incorporation: z.string().min(1, "Please select a country"),
  company_pin: z.string().min(1, "Company PIN/Tax ID is required"),
  date_of_incorporation: z.string().min(1, "Date of incorporation is required"),
  company_email: z.string().email("Please enter a valid company email"),
  employee_count: z.coerce.number().min(1, "Employee count must be at least 1"),
  admin_email: z.string().email("Please enter a valid admin email"),
  admin_username: z.string().min(3, "Username must be at least 3 characters"),
  admin_phone: z.string().min(6, "Phone number must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [companyUniqueId, setCompanyUniqueId] = useState("");
  const router = useRouter();

  const registerMutation = useRegisterCompany();

  // Initialize form
  const form = useForm<SignupFormValues>({
    // @ts-ignore
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      company_name: "",
      company_alias: "",
      country_of_incorporation: "",
      company_pin: "",
      date_of_incorporation: "",
      company_email: "",
      employee_count: 1,
      admin_email: "",
      admin_username: "",
      admin_phone: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        ...data,
        date_of_incorporation: new Date(
          data.date_of_incorporation
        ).toISOString(),
      });

      setCompanyUniqueId(response?.company?.uniqueId);
      setRegistrationSuccess(true);
      toast.success("Company registered successfully!");
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  if (registrationSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Toaster richColors />
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-kaziniBlue">
                  Registration Successful!
                </h1>
                <p className="text-balance text-kaziniMuted">
                  Your company has been registered successfully
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-kaziniBlue mb-2">
                  Important: Save Your Company ID
                </h3>
                <div className="bg-white p-3 rounded border">
                  <code className="text-lg font-mono font-bold text-blue-600">
                    {companyUniqueId}
                  </code>
                </div>
                <p className="text-sm text-kaziniMuted mt-2">
                  You will need this Company ID to log in. Please save it in a
                  secure place.
                </p>
              </div>

              <div className="text-sm text-kaziniMuted">
                <p>
                  A confirmation email has been sent to{" "}
                  <strong>{form.getValues("admin_email")}</strong> with your
                  company details and login instructions.
                </p>
              </div>

              <Button
                onClick={goToLogin}
                className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
              >
                Continue to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster richColors />
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-kaziniBlue">
                    Register Your Company
                  </h1>
                  <p className="text-balance text-kaziniMuted">
                    Enter your company details to get started
                  </p>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-kaziniBlue">
                    Company Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_alias"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Company Alias</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country_of_incorporation"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 text-kaziniBlue">
                        <FormLabel>Country of Incorporation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="company_pin"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Company PIN/Tax ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tax identification number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_of_incorporation"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Date of Incorporation</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(
                                    date ? date.toISOString() : ""
                                  );
                                }}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="company_email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Company Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="info@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employee_count"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Employee Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Admin Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-kaziniBlue">
                    Administrator Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="admin_email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 text-kaziniBlue">
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="admin@company.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="admin_username"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Admin Username</FormLabel>
                          <FormControl>
                            <Input placeholder="admin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="admin_phone"
                      render={({ field }) => (
                        <FormItem className="grid gap-2 text-kaziniBlue">
                          <FormLabel>Admin Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1234567890"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-kaziniBlue hover:bg-kaziniBlueLight"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Registering..."
                    : "Register Company"}
                </Button>

                <div className="text-center text-sm text-kaziniBlue">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
          </Form>

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
