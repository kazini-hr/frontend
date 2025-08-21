"use client";

import { useOutsourcedDashboard } from "@/lib/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
}

const DashboardCard = ({
  title,
  value,
  icon,
  className = "",
  subtitle,
  trend,
}: DashboardCardProps) => (
  <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">{trend.value}%</span>
          <span className="text-muted-foreground ml-1">{trend.label}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <Skeleton className="h-8 w-20 mb-1" />
          <Skeleton className="h-3 w-32" />
        </Card>
      ))}
    </div>
  </div>
);

function DashboardPage() {
  const { data: dashboard, isLoading, error } = useOutsourcedDashboard();
  const { user, checkAuth, logout } = useAuth();

  console.log("Dashboard data:", dashboard);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);
  console.log("User:", user);

  useEffect(() => {
    // Check if cookies exist
    console.log("Document cookies:", document.cookie);

    // Check localStorage for any authentication data
    console.log("localStorage auth_token:", localStorage.getItem("auth_token"));

    // Force auth check on dashboard load
    // checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!dashboard) return null;

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Outsourced Payroll Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your outsourced payroll operations and key metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Employees"
          value={dashboard.totalEmployees}
          icon={<Users />}
          className="border-blue-200 bg-blue-50/50"
          subtitle="All registered employees"
        />

        <DashboardCard
          title="Active Employees"
          value={dashboard.activeEmployees}
          icon={<UserCheck />}
          className="border-green-200 bg-green-50/50"
          subtitle="Currently receiving payroll"
        />

        <DashboardCard
          title="Payroll Cycles"
          value={dashboard.totalPayrollCycles}
          icon={<Calendar />}
          className="border-purple-200 bg-purple-50/50"
          subtitle="Total cycles processed"
        />

        <DashboardCard
          title="Last Payroll Run"
          value={formatDate(dashboard.lastPayrollRun)}
          icon={<Clock />}
          className="border-orange-200 bg-orange-50/50"
          subtitle={
            dashboard.lastPayrollRun
              ? "Most recent processing"
              : "No payroll processed yet"
          }
        />

        <DashboardCard
          title="Total Disbursed"
          value={formatCurrency(dashboard.totalAmountDisbursed)}
          icon={<DollarSign />}
          className="border-emerald-200 bg-emerald-50/50"
          subtitle="Lifetime disbursements"
        />

        <DashboardCard
          title="Pending Disbursements"
          value={dashboard.pendingDisbursements}
          icon={<Activity />}
          className={`${
            dashboard.pendingDisbursements > 0
              ? "border-red-200 bg-red-50/50"
              : "border-gray-200 bg-gray-50/50"
          }`}
          subtitle="Awaiting processing"
        />
      </div>

      {/* Status Alerts */}
      <div className="space-y-4">
        {dashboard.pendingDisbursements > 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {dashboard.pendingDisbursements} pending disbursement
              {dashboard.pendingDisbursements > 1 ? "s" : ""} waiting to be
              processed.
            </AlertDescription>
          </Alert>
        )}

        {dashboard.totalEmployees === 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Users className="h-4 w-4" />
            <AlertDescription>
              Get started by adding employees to your outsourced payroll system.
            </AlertDescription>
          </Alert>
        )}

        {dashboard.activeEmployees > 0 && !dashboard.lastPayrollRun && (
          <Alert className="border-green-200 bg-green-50">
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              You have {dashboard.activeEmployees} active employee
              {dashboard.activeEmployees > 1 ? "s" : ""} ready for payroll
              processing.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboard.activeEmployees > 0
                  ? Math.round(
                      (dashboard.activeEmployees / dashboard.totalEmployees) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Employee Utilization
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboard.totalPayrollCycles}
              </div>
              <div className="text-sm text-muted-foreground">
                Successful Cycles
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {dashboard.totalAmountDisbursed > 0 &&
                dashboard.totalPayrollCycles > 0
                  ? formatCurrency(
                      Math.round(
                        dashboard.totalAmountDisbursed /
                          dashboard.totalPayrollCycles
                      )
                    )
                  : "KES 0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg. per Cycle
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
