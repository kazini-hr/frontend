"use client";

import React, { useState } from "react";
import {
  useCompaniesOverview,
  handleAdminApiError,
} from "@/lib/admin-api-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Building2,
  Search,
  Plus,
  Users,
  Wallet,
  Calendar,
  Filter,
  Download,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore, isSuperAdmin } from "@/lib/auth";

const CompaniesOverview = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);

  const { data, isLoading, error } = useCompaniesOverview({
    limit: pageSize,
    offset: currentPage * pageSize,
    search: searchTerm || undefined,
    is_active:
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
        ? false
        : undefined,
    has_subscription:
      subscriptionFilter === "subscribed"
        ? true
        : subscriptionFilter === "unsubscribed"
        ? false
        : undefined,
  });

  const { toast } = useToast();

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

  const getSubscriptionBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Expired
          </Badge>
        );
      case "trial":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Trial
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  const getSizeBadge = (size: string) => {
    const colors = {
      SMALL: "bg-blue-100 text-blue-800 border-blue-200",
      MEDIUM: "bg-purple-100 text-purple-800 border-purple-200",
      LARGE: "bg-orange-100 text-orange-800 border-orange-200",
      ENTERPRISE: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge
        className={
          colors[size as keyof typeof colors] ||
          "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        {size}
      </Badge>
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSubscriptionFilter("");
    setCurrentPage(0);
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{handleAdminApiError(error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Companies Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all companies in the system
          </p>
        </div>

        {isSuperAdmin(user) && (
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button asChild>
              <Link href="/admin/companies/register">
                <Plus className="h-4 w-4 mr-2" />
                Register Company
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Companies
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.companies.filter((c) => c.is_active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                With Subscriptions
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {
                  data.companies.filter(
                    (c) => c.subscription_status === "active"
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.companies.reduce((sum, c) => sum + c.total_employees, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies by name, PIN, or admin email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={subscriptionFilter}
                onValueChange={setSubscriptionFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="subscribed">Subscribed</SelectItem>
                  <SelectItem value="unsubscribed">No Subscription</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters} className="px-3">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data?.companies.length ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No companies found</p>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter || subscriptionFilter
                  ? "Try adjusting your search criteria"
                  : "No companies have been registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{company.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            PIN: {company.company_pin}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {company.industry}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {company.admin_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {company.admin_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{company.industry}</Badge>
                      </TableCell>
                      <TableCell>{getSizeBadge(company.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {company.total_employees}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {formatCurrency(company.wallet_balance)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSubscriptionBadge(company.subscription_status)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={company.is_active ? "default" : "secondary"}
                        >
                          {company.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Navigate to company details
                              toast({
                                title: "Feature Coming Soon",
                                description:
                                  "Company details view will be available soon.",
                              });
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data && data.total > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min((currentPage + 1) * pageSize, data.total)} of{" "}
                {data.total} companies
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={(currentPage + 1) * pageSize >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {data && data.companies.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.companies
                  .filter((c) => c.last_payroll_date)
                  .sort(
                    (a, b) =>
                      new Date(b.last_payroll_date!).getTime() -
                      new Date(a.last_payroll_date!).getTime()
                  )
                  .slice(0, 5)
                  .map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-muted-foreground">
                          Last payroll run
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(company.last_payroll_date)}
                        </div>
                      </div>
                    </div>
                  ))}

                {data.companies.filter((c) => c.last_payroll_date).length ===
                  0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent payroll activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wallet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Balance:</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(
                      data.companies.reduce(
                        (sum, c) => sum + c.wallet_balance,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Companies with Low Balance (&lt; KES 50K):</span>
                  <span className="font-bold text-red-600">
                    {
                      data.companies.filter((c) => c.wallet_balance < 50000)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Balance:</span>
                  <span className="font-mono">
                    {formatCurrency(
                      data.companies.length > 0
                        ? data.companies.reduce(
                            (sum, c) => sum + c.wallet_balance,
                            0
                          ) / data.companies.length
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      {data && (
        <div className="space-y-4">
          {data.companies.filter((c) => c.wallet_balance < 50000 && c.is_active)
            .length > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {
                  data.companies.filter(
                    (c) => c.wallet_balance < 50000 && c.is_active
                  ).length
                }{" "}
                active companies have wallet balances below KES 50,000. They may
                need funding assistance.
              </AlertDescription>
            </Alert>
          )}

          {data.companies.filter(
            (c) => c.subscription_status !== "active" && c.is_active
          ).length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Crown className="h-4 w-4" />
              <AlertDescription>
                {
                  data.companies.filter(
                    (c) => c.subscription_status !== "active" && c.is_active
                  ).length
                }{" "}
                active companies don't have active subscriptions. Consider
                follow-up for conversion.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default CompaniesOverview;
