import type {
  OutsourcedDashboard,
  EmployeeOutsourced,
  BankCodesResponse,
  PayrollOutsourcedConfiguration,
  WalletBalance,
  WalletTransactionHistory,
  PayrollOutsourcedSummary,
  OutsourcedWalletFundResponse
} from './types';

// Mock Dashboard Data
export const mockDashboard: OutsourcedDashboard = {
  totalEmployees: 5,
  activeEmployees: 4,
  totalPayrollCycles: 2,
  lastPayrollRun: '2024-01-30T10:00:00Z',
  totalAmountDisbursed: 480000,
  pendingDisbursements: 1
};

// Mock Employees Data
export const mockEmployees: EmployeeOutsourced[] = [
  {
    id: 'emp_001',
    accountNumber: '1234567890',
    amount: 85000,
    bankCode: '01',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    companyId: 'comp_001'
  },
  {
    id: 'emp_002',
    accountNumber: '2345678901',
    amount: 120000,
    bankCode: '03',
    isActive: true,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    companyId: 'comp_001'
  },
  {
    id: 'emp_003',
    accountNumber: '3456789012',
    amount: 95000,
    bankCode: '11',
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
    companyId: 'comp_001'
  },
  {
    id: 'emp_004',
    accountNumber: '4567890123',
    amount: 75000,
    bankCode: '01',
    isActive: true,
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    companyId: 'comp_001'
  },
  {
    id: 'emp_005',
    accountNumber: '5678901234',
    amount: 65000,
    bankCode: '07',
    isActive: false,
    createdAt: '2024-01-19T12:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
    companyId: 'comp_001'
  }
];

// Mock Bank Codes Data
export const mockBankCodes: BankCodesResponse = {
  bankCodes: [
    { code: '01', name: 'Kenya Commercial Bank', bank: 'KCB' },
    { code: '03', name: 'Standard Chartered Bank', bank: 'SCB' },
    { code: '07', name: 'Barclays Bank of Kenya', bank: 'Barclays' },
    { code: '11', name: 'Equity Bank', bank: 'Equity' },
    { code: '12', name: 'Cooperative Bank', bank: 'Co-op Bank' }
  ],
  csvFormat: {
    headers: ['account_number', 'amount', 'bank_code'],
    example: ['1234567890', '50000', '01'],
    description: 'CSV file must have exactly 3 columns with the headers above'
  }
};

// Mock Payroll Configuration
export const mockPayrollConfig: PayrollOutsourcedConfiguration = {
  id: 'config_001',
  payrollPeriod: 'MONTHLY',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  dayOfPayment: 30,
  isActive: true,
  createdAt: '2024-01-01T08:00:00Z',
  updatedAt: '2024-01-01T08:00:00Z',
  companyId: 'comp_001',
  walletId: 'wallet_001'
};

// Mock Wallet Balance
export const mockWalletBalance: WalletBalance = {
  wallet_id: 'wallet_001',
  balance: 150000,
  currency: 'KES',
  wallet_type: 'PAYROLL',
  last_updated: '2024-01-30T15:30:00Z',
  wallet: {
  id: "cmc3hb4yo0000sxx5joici81p",
  balance: 115,
  currency: "KES",
  narrative: "Outsourced payroll disbursement wallet",
  subtype: "OUTSOURCED_PAYROLL",
  createdAt: "2025-06-19T14:31:09.792000+00:00",
  updatedAt: "2025-06-20T14:00:56.057000+00:00"
},
  exists: true,

};

// Mock Wallet Transactions
export const mockWalletTransactions: WalletTransactionHistory = {
  transactions: [
    {
      id: 'txn_001',
      transactionType: 'CREDIT',
      amount: 500000,
      reference: 'FUND_REF_001',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-28T10:00:00Z'
    },
    {
      id: 'txn_002',
      transactionType: 'DEBIT',
      amount: 350000,
      reference: 'PAYROLL_JAN_2024',
      paymentStatus: 'COMPLETED',
      createdAt: '2024-01-30T14:00:00Z'
    }
  ],
  total_count: 2,
  limit: 20,
  offset: 0
};

// Mock Payroll Summary
export const mockPayrollSummary: PayrollOutsourcedSummary = {
  employeeCount: 4,
  totalGrossPay: 375000, // Sum of active employees: 85000 + 120000 + 95000 + 75000
  totalNetPay: 300000, // After 20% PAYE deduction
  totalPayeTax: 75000, // 20% of gross pay
  totalKaziniHRFees: 6000, // 2% of net pay
  totalDisbursementAmount: 306000, // net pay + fees
  breakdown: [
    {
      employeeId: 'emp_001',
      accountNumber: '1234567890',
      bankCode: '01',
      grossPay: 85000,
      payeTax: 17000,
      netPay: 68000,
      kazinihrFee: 1360
    },
    {
      employeeId: 'emp_002',
      accountNumber: '2345678901',
      bankCode: '03',
      grossPay: 120000,
      payeTax: 24000,
      netPay: 96000,
      kazinihrFee: 1920
    },
    {
      employeeId: 'emp_003',
      accountNumber: '3456789012',
      bankCode: '11',
      grossPay: 95000,
      payeTax: 19000,
      netPay: 76000,
      kazinihrFee: 1520
    },
    {
      employeeId: 'emp_004',
      accountNumber: '4567890123',
      bankCode: '01',
      grossPay: 75000,
      payeTax: 15000,
      netPay: 60000,
      kazinihrFee: 1200
    }
  ],
  kazinihrAccount: {
    bankName: 'Kenya Commercial Bank',
    accountNumber: '9876543210',
    accountName: 'KaziniHR Limited',
    bankCode: '01'
  }
};

// Mock Fund Wallet Response
export const mockFundResponse: OutsourcedWalletFundResponse = {
  payment_id: 'pay_001',
  payment_method: 'bank_transfer',
  amount: 100000,
  reference: 'FUND_REF_002',
  status: 'pending',
  payment_instructions: {
    method: 'bank_transfer',
    bank_name: 'Kenya Commercial Bank',
    account_number: '1111222233',
    account_name: 'KaziniHR Collections',
    reference: 'FUND_REF_002',
    amount: 100000,
    note: 'Use the reference number for easy identification'
  },
  message: 'Payment instructions generated successfully'
};

// Mock Payroll Cycles for Reports
export const mockPayrollCycles = [
  {
    id: 'cycle_001',
    cycleCount: 1,
    runDate: '2024-01-30',
    employeeCount: 4,
    totalGrossPay: 375000,
    totalNetPay: 300000,
    totalPayeTax: 75000,
    totalKaziniHRFees: 6000,
    totalDisbursementAmount: 306000,
    hasRun: true,
    completed: true,
    status: 'COMPLETED'
  },
  {
    id: 'cycle_002',
    cycleCount: 2,
    runDate: '2024-02-29',
    employeeCount: 4,
    totalGrossPay: 375000,
    totalNetPay: 300000,
    totalPayeTax: 75000,
    totalKaziniHRFees: 6000,
    totalDisbursementAmount: 306000,
    hasRun: true,
    completed: false,
    status: 'PROCESSED'
  }
];

// Utility functions for mock API responses
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = async <T>(data: T, delayMs = 500): Promise<T> => {
  await delay(delayMs);
  return data;
};

// Mock API error responses
export const mockApiError = (message: string, status = 400) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { detail: message }
  };
  throw error;
};