"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Calculator,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    children: [
      { name: "All Employees", href: "/employees" },
      { name: "Onboarding", href: "/employees/onboarding" },
    ],
  },
  {
    name: "Leave Management",
    href: "/leave",
    icon: Calendar,
    children: [
      { name: "Leave Requests", href: "/leave" },
      { name: "Approve Requests", href: "/leave/requests" },
    ],
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: Clock,
    children: [
      { name: "Overview", href: "/attendance" },
      { name: "Timesheets", href: "/attendance/timesheets" },
    ],
  },
  {
    name: "Payroll",
    href: "/payroll",
    icon: DollarSign,
    children: [
      { name: "Payroll Management", href: "/payroll" },
      { name: "PAYE Calculator", href: "/payroll/calculator" },
    ],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Navigation</h2>}
        <Button
          color="zinc"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.name);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name}>
              <div className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => {
                    if (hasChildren && !collapsed) {
                      toggleExpanded(item.name);
                    }
                  }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.name}</span>
                      {hasChildren && (
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* {hasChildren && !collapsed && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        pathname === child.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )} */}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
