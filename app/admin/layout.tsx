"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, isAdmin, isSuperAdmin, UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Webhook,
  Mail,
  Settings,
  Shield,
  Activity,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  superAdminOnly?: boolean;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: "System overview and metrics",
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: <Building2 className="h-4 w-4" />,
    description: "Manage companies and registration",
    children: [
      {
        title: "Overview",
        href: "/admin/companies",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        title: "Register New",
        href: "/admin/companies/register",
        icon: <Building2 className="h-4 w-4" />,
        superAdminOnly: true,
      },
    ],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-4 w-4" />,
    description: "User management and roles",
  },
  {
    title: "Tax Administration",
    href: "/admin/tax",
    icon: <Receipt className="h-4 w-4" />,
    description: "Tax rates and configuration",
    superAdminOnly: true,
  },
  {
    title: "Monitoring",
    href: "/admin/monitoring",
    icon: <Activity className="h-4 w-4" />,
    description: "System monitoring and logs",
    children: [
      {
        title: "Webhooks",
        href: "/admin/monitoring/webhooks",
        icon: <Webhook className="h-4 w-4" />,
      },
      {
        title: "Emails",
        href: "/admin/monitoring/emails",
        icon: <Mail className="h-4 w-4" />,
      },
      {
        title: "System Health",
        href: "/admin/monitoring/health",
        icon: <Activity className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
    description: "System configuration",
  },
];

// Breadcrumb Component
const Breadcrumb = ({ pathname }: { pathname: string }) => {
  const pathSegments = pathname.split("/").filter(Boolean);

  const getBreadcrumbItems = () => {
    const items = [{ label: "Admin", href: "/admin" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      if (segment === "admin") return;

      currentPath += `/${segment}`;
      const fullPath = `/admin${currentPath}`;

      // Capitalize and format segment
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
      items.push({ label, href: fullPath });
    });

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          <Link
            href={item.href}
            className={cn(
              "hover:text-foreground transition-colors",
              index === items.length - 1 && "text-foreground font-medium"
            )}
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

// User Menu Component
const UserMenu = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) return null;

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase() ?? "U";
  };

  const getPrimaryRole = (roles: string[]) => {
    if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
    if (roles.includes("COMPANY_ADMIN")) return "COMPANY_ADMIN";
    return roles[0] || "USER";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "COMPANY_ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="h-3 w-3" />;
      case "COMPANY_ADMIN":
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const primaryRole = getPrimaryRole(user.user.roles);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {getInitials(user.user.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.user.username}</p>
            <p className="text-xs text-muted-foreground">{user.user.email}</p>
            <Badge
              variant="outline"
              className={cn("text-xs w-fit", getRoleColor(primaryRole))}
            >
              {getRoleIcon(primaryRole)}
              <span className="ml-1">{primaryRole.replace("_", " ")}</span>
            </Badge>
            {user.user.roles.length > 1 && (
              <p className="text-xs text-muted-foreground">
                +{user.user.roles.length - 1} more role
                {user.user.roles.length > 2 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Mobile Navigation Component
const MobileNav = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const filteredNavigation = navigation.filter(
    (item) => !item.superAdminOnly || isSuperAdmin(user)
  );

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = ({
  pathname,
  user,
}: {
  pathname: string;
  user: any;
}) => {
  const filteredNavigation = navigation.filter(
    (item) => !item.superAdminOnly || isSuperAdmin(user)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:block">
      <div className="flex h-full flex-col bg-background border-r shadow-sm">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 p-6 border-b bg-background">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">KaziniHR System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all",
                  "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-accent text-accent-foreground shadow-sm border"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
                {item.superAdminOnly && (
                  <Crown className="h-3 w-3 text-purple-500" />
                )}
              </Link>

              {/* Sub-navigation */}
              {item.children &&
                (pathname === item.href ||
                  pathname.startsWith(item.href + "/")) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children
                      .filter(
                        (child) => !child.superAdminOnly || isSuperAdmin(user)
                      )
                      .map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors",
                            "hover:bg-accent/50 hover:text-accent-foreground",
                            pathname === child.href
                              ? "bg-accent/70 text-accent-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {child.icon}
                          {child.title}
                          {child.superAdminOnly && (
                            <Crown className="h-2 w-2 text-purple-500" />
                          )}
                        </Link>
                      ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t bg-background">
          <Card className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="text-xs text-muted-foreground">
              <div className="font-medium mb-1 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Access
              </div>
              <p>
                You have {isSuperAdmin(user) ? "Super Admin" : "Company Admin"}{" "}
                privileges.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Access Control Component
const AdminAccessControl = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  console.log("AdminAccessControl user:", user);
  console.log("AdminAccessControl isAuthenticated:", isAuthenticated);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <AdminAccessControl>
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <DesktopSidebar pathname={pathname} user={user} />

        {/* Mobile Navigation */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          user={user}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-background border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileNavOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">
                    KaziniHR System
                  </p>
                </div>
              </div>
              <UserMenu />
            </div>
          </header>

          {/* Desktop Header with Breadcrumb */}
          <header className="hidden lg:block sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <Breadcrumb pathname={pathname} />
              <UserMenu />
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
    </AdminAccessControl>
  );
}
