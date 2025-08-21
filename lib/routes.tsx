export const MAIN_ROUTES = {
  DASHBOARD: "/dashboard",
};

export const OUTSOURCED_ROUTES = {
  DASHBOARD: "/outsourced/dashboard",
  EMPLOYEES: "/outsourced/employees",
  WALLET: "/outsourced/wallet",
  PAYROLL: "/outsourced/payroll",
};

export const COMPANY_ROUTES = {
  MAIN: "/company",
  LOCATIONS: "/company/locations",
  EMPLOYEES: "/company/employees",
  TIMESHEETS: "/company/timesheets",
  DETAILS: "/company/details",
};

export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "Outsourced",
    items: [
      { title: "Dashboard", href: OUTSOURCED_ROUTES.DASHBOARD },
      { title: "Employees", href: OUTSOURCED_ROUTES.EMPLOYEES },
      { title: "Wallet", href: OUTSOURCED_ROUTES.WALLET },
      { title: "Payroll", href: OUTSOURCED_ROUTES.PAYROLL },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Details", href: COMPANY_ROUTES.DETAILS },
      {
        title: "Employees",
        href: COMPANY_ROUTES.EMPLOYEES,
      },
      { title: "Timesheets", href: COMPANY_ROUTES.TIMESHEETS },
      { title: "Locations", href: COMPANY_ROUTES.LOCATIONS },
    ],
  },
];
