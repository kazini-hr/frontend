"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ChevronRight, LogOut, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/lib/api-hooks";
import { navigation } from "@/lib/routes";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
}

const allRoutes = [...navigation.payroll, ...navigation.company];
// Breadcrumb Component
const Breadcrumb = ({ pathname }: { pathname: string }) => {
  const pathSegments = pathname.split("/").filter(Boolean);

  const getBreadcrumbItems = () => {
    const items = [{ label: "Dashboard", href: "/dashboard" }];

    if (pathSegments.includes("outsourced")) {
      items.push({ label: "Main", href: "/outsourced" });

      const currentNav = allRoutes.find((nav) => nav.href === pathname);
      if (currentNav && currentNav.href !== "/outsourced/dashboard") {
        items.push({ label: currentNav.title, href: currentNav.href });
      }
    }

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

// Mobile Navigation Component
const MobileNav = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

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
          <Image
            src="/images/kazini-logo-only.png"
            alt="logo"
            width={32}
            height={32}
          />
          <h2 className="text-lg font-semibold">KaziniHR</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-md font-bold text-gray-900">Payroll</div>
          {navigation.payroll.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-colors",
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

          <div className="text-md font-bold text-gray-900 pt-4">Company</div>
          {navigation.company.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-colors",
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
const DesktopSidebar = ({ pathname }: { pathname: string }) => {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 px-6 pb-4 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image
              src="/images/kazini-logo-only.png"
              alt="logo"
              width={32}
              height={32}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">KaziniHR</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-1">
          <div className="text-md font-bold text-gray-900">Payroll</div>
          {navigation.payroll.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0",
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate">{item.title}</div>
                {item.description && (
                  <div
                    className={cn(
                      "text-xs truncate",
                      pathname === item.href ? "text-blue-500" : "text-gray-500"
                    )}
                  >
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

          <div className="text-md font-bold text-gray-900 pt-4">Company</div>
          {navigation.company.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-colors",
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

        {/* Footer */}
        <div className="px-4 pt-4 border-t border-gray-200">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Need Help?</div>
              <p>Contact support for assistance with your payroll system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Dropdown Component
const ProfileDropdown = () => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-full">
            <User size={18} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/outsourced/profile" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-500 cursor-pointer focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function OutsourcedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar pathname={pathname} />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
              <div>
                <Image
                  src="/images/kazini-hr-original-colors-transparent.png"
                  alt="Kazini HR"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <ProfileDropdown />
          </div>
        </header>

        {/* Desktop Header with Breadcrumb */}
        <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Breadcrumb pathname={pathname} />
            <ProfileDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-screen bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
