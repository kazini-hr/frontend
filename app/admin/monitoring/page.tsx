// app/admin/monitoring/page.tsx
"use client";

import React, { useState } from "react";
import {
  useWebhookMonitoring,
  useWebhookStats,
  useEmailMonitoring,
  useSystemHealth,
  useReplayWebhook,
  useResendEmail,
  useBulkResendEmails,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity,
  Webhook,
  Mail,
  RefreshCw,
  Play,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Database,
  Zap,
  Server,
  Globe,
} from "lucide-react";

// Webhook Monitoring Component
const WebhookMonitoring = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedWebhooks, setSelectedWebhooks] = useState<string[]>([]);

  const {
    data: webhooks,
    isLoading: webhooksLoading,
    refetch: refetchWebhooks,
  } = useWebhookMonitoring({
    status: statusFilter || undefined,
    webhook_type: typeFilter || undefined,
    hours: 24,
  });

  const { data: webhookStats } = useWebhookStats(24);
  const replayWebhook = useReplayWebhook();
  const { toast } = useToast();

  const handleReplay = async (monitoringId: string) => {
    try {
      await replayWebhook.mutateAsync(monitoringId);
      toast({
        title: "Webhook Replayed",
        description: "The webhook has been queued for replay.",
      });
      refetchWebhooks();
    } catch (error) {
      toast({
        title: "Replay Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Success
          </Badge>
        );
      case "failed":
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        );
      case "pending":
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "retrying":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Retrying
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-KE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Webhook Stats */}
      {webhookStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Webhooks
                  </p>
                  <p className="text-2xl font-bold">
                    {webhookStats.total_webhooks}
                  </p>
                </div>
                <Webhook className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {webhookStats.success_rate || 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {webhookStats.failed_webhooks}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Response
                  </p>
                  <p className="text-2xl font-bold">
                    {webhookStats.avg_response_time || 0}ms
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="retrying">Retrying</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="payroll_processed">
                  Payroll Processed
                </SelectItem>
                <SelectItem value="employee_created">
                  Employee Created
                </SelectItem>
                <SelectItem value="disbursement_completed">
                  Disbursement Completed
                </SelectItem>
                <SelectItem value="wallet_funded">Wallet Funded</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("");
                setTypeFilter("");
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Table */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Activity (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          {webhooksLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !webhooks?.webhooks.length ? (
            <div className="text-center py-8">
              <Webhook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No webhook activity</p>
              <p className="text-muted-foreground">
                No webhooks found in the last 24 hours
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Last Attempt</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {webhook.webhook_type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{webhook.company_name}</div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 rounded">
                        {webhook.endpoint.length > 30
                          ? `${webhook.endpoint.substring(0, 30)}...`
                          : webhook.endpoint}
                      </code>
                    </TableCell>
                    <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{webhook.attempts}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(webhook.last_attempt)}</TableCell>
                    <TableCell>
                      {webhook.response_status ? (
                        <Badge
                          variant={
                            webhook.response_status < 400
                              ? "default"
                              : "destructive"
                          }
                        >
                          {webhook.response_status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {webhook.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReplay(webhook.id)}
                          disabled={replayWebhook.isPending}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Replay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Email Monitoring Component
const EmailMonitoring = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const {
    data: emails,
    isLoading: emailsLoading,
    refetch: refetchEmails,
  } = useEmailMonitoring({
    status: statusFilter || undefined,
    email_type: typeFilter || undefined,
    hours: 24,
  });

  const resendEmail = useResendEmail();
  const bulkResendEmails = useBulkResendEmails();
  const { toast } = useToast();

  const handleResend = async (emailId: string) => {
    try {
      await resendEmail.mutateAsync(emailId);
      toast({
        title: "Email Resent",
        description: "The email has been queued for resending.",
      });
      refetchEmails();
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  const handleBulkResend = async () => {
    if (selectedEmails.length === 0) {
      toast({
        title: "No Emails Selected",
        description: "Please select emails to resend.",
        variant: "destructive",
      });
      return;
    }

    try {
      await bulkResendEmails.mutateAsync(selectedEmails);
      toast({
        title: "Emails Queued",
        description: `${selectedEmails.length} emails have been queued for resending.`,
      });
      setSelectedEmails([]);
      refetchEmails();
    } catch (error) {
      toast({
        title: "Bulk Resend Failed",
        description: handleAdminApiError(error),
        variant: "destructive",
      });
    }
  };

  const getEmailStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Sent
          </Badge>
        );
      case "failed":
      case "bounced":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        );
      case "pending":
      case "queued":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="ADMIN_COMPANY_REGISTRATION">
                    Company Registration
                  </SelectItem>
                  <SelectItem value="EMPLOYEE_WELCOME">
                    Employee Welcome
                  </SelectItem>
                  <SelectItem value="PAYROLL_SUMMARY">
                    Payroll Summary
                  </SelectItem>
                  <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedEmails.length > 0 && (
              <Button
                onClick={handleBulkResend}
                disabled={bulkResendEmails.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                Resend Selected ({selectedEmails.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Activity (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          {emailsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !emails?.emails.length ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No email activity</p>
              <p className="text-muted-foreground">
                No emails found in the last 24 hours
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEmails.length === emails.emails.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEmails(emails.emails.map((e) => e.id));
                        } else {
                          setSelectedEmails([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmails.includes(email.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEmails([...selectedEmails, email.id]);
                          } else {
                            setSelectedEmails(
                              selectedEmails.filter((id) => id !== email.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {email.email_type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{email.recipient}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={email.subject}>
                        {email.subject}
                      </div>
                    </TableCell>
                    <TableCell>{email.company_name || "-"}</TableCell>
                    <TableCell>{getEmailStatusBadge(email.status)}</TableCell>
                    <TableCell>
                      {new Date(email.sent_at).toLocaleString("en-KE", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {email.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResend(email.id)}
                          disabled={resendEmail.isPending}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Resend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// System Health Component
const SystemHealthMonitoring = () => {
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  const getHealthColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getHealthIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "healthy":
      case "good":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
      case "degraded":
        return <AlertTriangle className="h-5 w-5" />;
      case "critical":
      case "unhealthy":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (healthLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!health) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load system health information.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className={`border-l-4 ${getHealthColor(health.database_status)}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Database
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthIcon(health.database_status)}
                  <span className="font-medium">{health.database_status}</span>
                </div>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${getHealthColor(health.cache_status)}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cache
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthIcon(health.cache_status)}
                  <span className="font-medium">{health.cache_status}</span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${getHealthColor(
            health.email_service_status
          )}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email Service
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthIcon(health.email_service_status)}
                  <span className="font-medium">
                    {health.email_service_status}
                  </span>
                </div>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${getHealthColor(
            health.payment_service_status
          )}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Service
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {getHealthIcon(health.payment_service_status)}
                  <span className="font-medium">
                    {health.payment_service_status}
                  </span>
                </div>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {health.uptime || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {health.response_time || 0}ms
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Response Time
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {health.active_connections || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Connections
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Monitoring Page
export default function MonitoringPage() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor webhooks, emails, and system health across the platform
        </p>
      </div>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks">
          <WebhookMonitoring />
        </TabsContent>

        <TabsContent value="emails">
          <EmailMonitoring />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
}
