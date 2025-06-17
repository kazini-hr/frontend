"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAuthStore } from "@/store/auth";

// Mock data for charts
const attendanceData = [
  { name: "Mon", present: 45, absent: 5 },
  { name: "Tue", present: 48, absent: 2 },
  { name: "Wed", present: 46, absent: 4 },
  { name: "Thu", present: 49, absent: 1 },
  { name: "Fri", present: 47, absent: 3 },
];

const payrollTrend = [
  { month: "Jan", amount: 2400000 },
  { month: "Feb", amount: 2380000 },
  { month: "Mar", amount: 2420000 },
  { month: "Apr", amount: 2450000 },
  { month: "May", amount: 2480000 },
  { month: "Jun", amount: 2500000 },
];

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={`text-xs ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 17) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const quickActions = [
    {
      title: "Add Employee",
      description: "Onboard a new team member",
      icon: <UserPlus className="h-5 w-5" />,
      href: "/employees/onboarding",
      color: "bg-blue-500",
    },
    {
      title: "Process Payroll",
      description: "Run monthly payroll",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/payroll",
      color: "bg-green-500",
    },
    {
      title: "Review Leave",
      description: "Approve pending requests",
      icon: <Calendar className="h-5 w-5" />,
      href: "/leave/requests",
      color: "bg-orange-500",
    },
    {
      title: "View Reports",
      description: "Generate analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/reports",
      color: "bg-purple-500",
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Review John Doe's leave request",
      type: "leave",
      urgent: true,
    },
    {
      id: 2,
      title: "Complete Sarah Smith onboarding",
      type: "onboarding",
      urgent: false,
    },
    { id: 3, title: "Process March payroll", type: "payroll", urgent: true },
    { id: 4, title: "Update company policies", type: "policy", urgent: false },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Employee added",
      details: "Mike Johnson joined Engineering",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Leave approved",
      details: "Sarah Wilson - Annual Leave",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "Payroll processed",
      details: "February 2025 payroll completed",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Policy updated",
      details: "Remote work policy revised",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Good {timeOfDay}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your team today.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Activity className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value="248"
          description="Active employees"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Present Today"
          value="234"
          description="94% attendance rate"
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Pending Leaves"
          value="12"
          description="Awaiting approval"
          icon={<Calendar className="h-4 w-4" />}
          trend={{ value: 15, isPositive: false }}
        />
        <StatsCard
          title="Monthly Payroll"
          value="KES 2.5M"
          description="Current month budget"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 3.5, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used HR functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                outline
                className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:bg-accent/50 transition-colors"
              >
                <a href={action.href}>
                  <div className={`${action.color} text-white p-2 rounded-lg`}>
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>Employee attendance this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#3b82f6" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest HR activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.details}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Payroll Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Payroll Trend</CardTitle>
                <CardDescription>
                  Monthly payroll expenses over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={payrollTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `KES ${(value as number).toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engineering</span>
                    <span className="text-sm font-medium">85</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sales</span>
                    <span className="text-sm font-medium">65</span>
                  </div>
                  <Progress value={65} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Marketing</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                  <Progress value={45} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Operations</span>
                    <span className="text-sm font-medium">35</span>
                  </div>
                  <Progress value={35} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">HR</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Important HR KPIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Employee Satisfaction</span>
                  <Badge variant="secondary">87%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retention Rate</span>
                  <Badge variant="secondary">94%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Tenure</span>
                  <Badge variant="secondary">3.2 years</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Training Completion</span>
                  <Badge variant="secondary">91%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {task.urgent ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {task.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      <Button className="h-5 w-5" outline>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
