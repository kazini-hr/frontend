import { ROLES } from "./constants";

export interface OutsourcedDashboard {
  totalEmployees: number;
  activeEmployees: number;
  totalPayrollCycles: number;
  lastPayrollRun: string | null;
  totalAmountDisbursed: number;
  pendingDisbursements: number;
}

export interface EmployeeOutsourced {
  id: string;
  accountNumber: string;
  amount: number;
  bankCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface BankCode {
  code: string;
  name: string;
  bank: string;
}

export interface BankCodesResponse {
  bankCodes: BankCode[];
  csvFormat: {
    headers: string[];
    example: string[];
    description: string;
  };
}

export interface PayrollOutsourcedConfiguration {
  id: string;
  payrollPeriod: "MONTHLY" | "WEEKLY" | "BIWEEKLY";
  startDate: string;
  endDate: string;
  dayOfPayment: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  walletId: string;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  subtype: string;
  narrative: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  wallet_id: string;
  balance: number;
  currency: string;
  wallet_type: string;
  last_updated: string;
  wallet: Wallet | null;
  can_create?: boolean;
  exists: boolean;
  message?: string;
}

export interface WalletTransaction {
  id: string;
  transactionType: "CREDIT" | "DEBIT";
  amount: number;
  reference: string;
  paymentStatus: string;
  createdAt: string;
}

export interface WalletTransactionHistory {
  transactions: WalletTransaction[];
  total_count: number;
  limit: number;
  offset: number;
}

export interface PayrollOutsourcedSummary {
  employeeCount: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalPayeTax: number;
  totalKaziniHRFees: number;
  totalDisbursementAmount: number;
  breakdown: Array<{
    employeeId: string;
    accountNumber: string;
    bankCode: string;
    grossPay: number;
    payeTax: number;
    netPay: number;
    kazinihrFee: number;
  }>;
  kazinihrAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
}

export interface OutsourcedWalletFundRequest {
  amount: number;
  payment_method: "bank_transfer" | "mpesa";
  customer_phone?: string;
}

export interface OutsourcedWalletFundResponse {
  payment_id: string;
  payment_method: string;
  amount: number;
  reference: string;
  status: string;
  payment_instructions: {
    method: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
    reference: string;
    amount: number;
    note?: string;
  };
  message: string;
}

export interface RegisterCompanyRequest {
  company_name: string;
  company_email: string;
  country_of_incorporation: string;
  company_pin: string;
  date_of_incorporation: string;
  employee_count: number;

  admin_email: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_middle_name?: string;
  admin_phone?: string;
}

export interface RegisterCompanyResponse {
  message: string;
  company_unique_id: string;
  admin_email: string;
  company: {
    uniqueId: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  company_unique_id: string;
  two_factor_code?: string;
}

export interface LoginResponse {
  message: string;
  requires_2fa?: boolean;
  requires_2fa_setup?: boolean;
  session_token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    company_id: string;
  };
}

export interface Setup2FARequest {
  email: string;
  password: string;
  company_unique_id: string;
}

export interface Setup2FAResponse {
  qr_code_url: string;
  backup_codes: string[];
}

export interface Verify2FARequest {
  email: string;
  password: string;
  company_unique_id: string;
  token: string;
}

export interface Verify2FAResponse {
  message: string;
  setup_complete: boolean;
}

export interface Company {
  id: string;
  name: string;
  company_pin: string;
  country_of_incorporation: string;
  date_of_incorporation: string;
  company_email: string;
}

export interface CreateCompanyLocation {
  name: string;
  description?: string;
}
export interface CompanyLocation {
  id: string;
  name: string;
  description: string;
  companyId: string;
}

export interface UpdateCompanyLocation {
  id: string;
  name: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phoneNumber: string | null;
  roles: string[];
  companyId: string;
  isActive: boolean;
  isEmailVerified: boolean;
  company: Company | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployee {
  firstName: string;
  middleName?: string;
  lastName: string;
  workEmail: string;
  phoneNumber?: string;
  nationalId?: string;
  kraPin?: string;
  shif?: string;
  nssf?: string;
  internalEmployeeId?: string;
  locationId?: string;
  roles: RoleKey[];
}

export interface UpdateEmployee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  workEmail: string;
  phoneNumber?: string;
  nationalId?: string;
  kraPin?: string;
  shif?: string;
  nssf?: string;
  internalEmployeeId?: string;
}

export interface UpdateEmployeeRole {
  id: string;
  role: RoleKey;
  locationId: null | string;
}

export interface Employee {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  workEmail: string;
  phoneNumber: string | null;
  nationalId: string | null;
  kraPin: string | null;
  shif: string | null;
  nssf: string | null;
  internalEmployeeId: string;
  locationId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  createdBy: string | null;
  companyId: string;
  location: CompanyLocation | null;
  userProfile: UserProfile;
}

export type RoleKey = keyof typeof ROLES;

export interface Me {
  id: string;
  email: string;
  username: string;
  company: {
    id: string;
    name: string;
    alias: string;
    country_of_incorporation: string;
    date_of_incorporation: string;
    employee_count: number;
  };
  company_id: string;
  user: {
    id: string;
    email: string;
    username: string;
    roles: RoleKey[];
    is_active: boolean;
    is_verified: boolean;
    phone_number: string;
    has_2fa: boolean;
  };
}

export interface Timesheet {
  id: string;
  employee: Pick<
    Employee,
    | "id"
    | "internalEmployeeId"
    | "firstName"
    | "middleName"
    | "lastName"
    | "workEmail"
  >;
  companyLocation: CompanyLocation;
  timeIn: string;
  timeOut: string | null;
  timeInApprovedBy: Pick<
    Employee,
    | "id"
    | "internalEmployeeId"
    | "firstName"
    | "middleName"
    | "lastName"
    | "workEmail"
  >;
  timeOutApprovedBy: Pick<
    Employee,
    | "id"
    | "internalEmployeeId"
    | "firstName"
    | "middleName"
    | "lastName"
    | "workEmail"
  > | null;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}
