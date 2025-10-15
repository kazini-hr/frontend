"use client";

import React from "react";
import { useAdminDashboardStats, useSystemHealth } from "@/lib/admin-api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore, isSuperAdmin } from "@/lib/auth";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  href?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  className = "",
  subtitle,
  trend,
  href,
}: DashboardCardProps) => {
  const CardWrapper = href ? Link : "div";

  return (
    <CardWrapper href={href || ""} className={href ? "block" : ""}>
      <Card
        className={`transition-all duration-200 hover:shadow-lg ${
          href ? "cursor-pointer hover:scale-105" : ""
        } ${className}`}
      >
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
              <TrendingUp
                className={`h-3 w-3 mr-1 ${
                  trend.positive !== false ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`font-medium ${
                  trend.positive !== false ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.positive !== false ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground ml-1">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
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

const SystemHealthIndicator = ({ health }: { health: any }) => {
  if (!health) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "good":
        return "text-green-600 bg-green-100 border-green-200";
      case "warning":
      case "degraded":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "critical":
      case "unhealthy":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "good":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
      case "degraded":
        return <AlertCircle className="h-4 w-4" />;
      case "critical":
      case "unhealthy":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(health.database_status)} border`}
            >
              {getStatusIcon(health.database_status)}
              <span className="ml-1">Database</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(health.cache_status)} border`}>
              {getStatusIcon(health.cache_status)}
              <span className="ml-1">Cache</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                health.email_service_status
              )} border`}
            >
              {getStatusIcon(health.email_service_status)}
              <span className="ml-1">Email</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                health.payment_service_status
              )} border`}
            >
              {getStatusIcon(health.payment_service_status)}
              <span className="ml-1">Payments</span>
            </Badge>
          </div>
        </div>

        {health.uptime && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <strong>System Uptime:</strong> {health.uptime}
            </div>
            {health.response_time && (
              <div className="text-sm text-muted-foreground">
                <strong>Avg Response Time:</strong> {health.response_time}ms
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminDashboardStats();
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  const formatCurrency = (amount: number) =>
    `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

  if (statsError) {
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

  if (statsLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          {isSuperAdmin(user) && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Crown className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          System overview and management controls for KaziniHR
        </p>
      </div>

      {/* System Health */}
      {!healthLoading && health && <SystemHealthIndicator health={health} />}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Companies"
          value={stats.total_companies}
          icon={<Building2 />}
          className="border-blue-200 bg-blue-50/50"
          subtitle={`${stats.active_companies} active`}
          trend={{
            value: Math.round(
              (stats.active_companies / stats.total_companies) * 100
            ),
            label: "active rate",
          }}
          href="/admin/companies"
        />

        <DashboardCard
          title="Total Users"
          value={stats.total_users}
          icon={<Users />}
          className="border-green-200 bg-green-50/50"
          subtitle="All platform users"
          href="/admin/users"
        />

        <DashboardCard
          title="Active Subscriptions"
          value={stats.active_subscriptions}
          icon={<CreditCard />}
          className="border-purple-200 bg-purple-50/50"
          subtitle="Paying customers"
          trend={{
            value: Math.round(
              (stats.active_subscriptions / stats.total_companies) * 100
            ),
            label: "conversion rate",
          }}
        />

        <DashboardCard
          title="Outsourced Companies"
          value={stats.outsourced_companies}
          icon={<Zap />}
          className="border-orange-200 bg-orange-50/50"
          subtitle="Using outsourced payroll"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Wallet Balance"
          value={formatCurrency(stats.total_wallet_balance)}
          icon={<Wallet />}
          className="border-emerald-200 bg-emerald-50/50"
          subtitle="All company wallets"
        />

        <DashboardCard
          title="Monthly Disbursements"
          value={formatCurrency(stats.monthly_disbursements)}
          icon={<DollarSign />}
          className="border-slate-200 bg-slate-50/50"
          subtitle="This month's payouts"
        />

        <DashboardCard
          title="Payroll Cycles"
          value={stats.recent_payroll_cycles}
          icon={<FileText />}
          className="border-indigo-200 bg-indigo-50/50"
          subtitle="Recent cycles processed"
        />

        <DashboardCard
          title="Disbursement Batches"
          value={stats.total_disbursement_batches}
          icon={<Activity />}
          className="border-rose-200 bg-rose-50/50"
          subtitle="Total batches created"
        />
      </div>

      {/* User Role Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Role Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {stats.users_by_role.SUPER_ADMIN}
              </div>
              <div className="text-sm text-purple-600 flex items-center justify-center gap-1">
                <Crown className="h-3 w-3" />
                Super Admins
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {stats.users_by_role.COMPANY_ADMIN}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                Company Admins
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-gray-700">
                {stats.users_by_role.EMPLOYEE}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Employees
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/companies/register">
                <Building2 className="h-6 w-6" />
                <span>Register Company</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <Link href="/admin/users">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Link>
            </Button>

            {isSuperAdmin(user) && (
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
              >
                <Link href="/admin/tax">
                  <FileText className="h-6 w-6" />
                  <span>Tax Administration</span>
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <Link href="/admin/monitoring">
                <Activity className="h-6 w-6" />
                <span>System Monitoring</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      <div className="space-y-4">
        {stats.active_subscriptions / stats.total_companies < 0.5 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Subscription conversion rate is below 50%. Consider reviewing
              pricing or outreach strategies.
            </AlertDescription>
          </Alert>
        )}

        {stats.total_wallet_balance < 1000000 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Total wallet balance is running low. Monitor company funding to
              ensure smooth operations.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
