import {
  Building2,
  Calculator,
  Calendar,
  FileText,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export const MAIN_ROUTES = {
  DASHBOARD: "/dashboard",
};

export const OUTSOURCED_ROUTES = {
  DASHBOARD: "/outsourced/dashboard",
  EMPLOYEES: "/outsourced/employees",
  WALLET: "/outsourced/wallet",
  PAYROLL_CONFIG: "/outsourced/payroll/config",
  PAYROLL_SUMMARY: "/outsourced/payroll/summary",
  PAYROLL_REPORTS: "/outsourced/payroll/reports",
};

export const COMPANY_ROUTES = {
  MAIN: "/company",
  LOCATIONS: "/company/locations",
  EMPLOYEES: "/company/employees",
  TIMESHEETS: "/company/timesheets",
  DETAILS: "/company/details",
};

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  groupTitle: string;
}

export const navigation: { payroll: NavItem[]; company: NavItem[] } = {
  company: [
    {
      title: "Details",
      href: COMPANY_ROUTES.DETAILS,
      icon: <Building2 className="h-4 w-4" />,
      description: "Company Details",
      groupTitle: "Company",
    },
    {
      title: "Employees",
      href: COMPANY_ROUTES.EMPLOYEES,
      icon: <Users className="h-4 w-4" />,
      description: "Manage employee data",
      groupTitle: "Company",
    },
    {
      title: "Locations",
      href: COMPANY_ROUTES.LOCATIONS,
      icon: <MapPin className="h-4 w-4" />,
      description: "Manage company locations",
      groupTitle: "Company",
    },
    {
      title: "Timesheets",
      href: COMPANY_ROUTES.TIMESHEETS,
      icon: <Calendar className="h-4 w-4" />,
      description: "Manage company timesheets",
      groupTitle: "Company",
    },
  ],
  payroll: [
    {
      title: "Dashboard",
      href: OUTSOURCED_ROUTES.DASHBOARD,
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: "Overview and metrics",
      groupTitle: "Payroll",
    },
    {
      title: "Employees",
      href: OUTSOURCED_ROUTES.EMPLOYEES,
      icon: <Users className="h-4 w-4" />,
      description: "Manage employee data",
      groupTitle: "Payroll",
    },
    {
      title: "Wallet",
      href: OUTSOURCED_ROUTES.WALLET,
      icon: <Wallet className="h-4 w-4" />,
      description: "Fund and manage wallet",
      groupTitle: "Payroll",
    },
    {
      title: "Payroll Config",
      href: OUTSOURCED_ROUTES.PAYROLL_CONFIG,
      icon: <Settings className="h-4 w-4" />,
      description: "Configure payroll settings",
      groupTitle: "Payroll",
    },
    {
      title: "Payroll Summary",
      href: OUTSOURCED_ROUTES.PAYROLL_SUMMARY,
      icon: <Calculator className="h-4 w-4" />,
      description: "Review before processing",
      groupTitle: "Payroll",
    },
    {
      title: "Reports",
      href: OUTSOURCED_ROUTES.PAYROLL_REPORTS,
      icon: <FileText className="h-4 w-4" />,
      description: "View payroll history",
      groupTitle: "Payroll",
    },
  ],
};
