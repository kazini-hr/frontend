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
  transactionType: 'CREDIT' | 'DEBIT';
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
  company_alias: string;
  country_of_incorporation: string;
  company_pin: string;
  date_of_incorporation: string;
  company_email: string;
  employee_count: number;
  admin_email: string;
  admin_username: string;
  admin_phone: string;
}

export interface RegisterCompanyResponse {
  message: string;
  company_unique_id: string;
  admin_email: string;
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