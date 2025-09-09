import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import api from "./api";
import {
  mockDashboard,
  mockEmployees,
  mockBankCodes,
  mockPayrollConfig,
  mockWalletBalance,
  mockWalletTransactions,
  mockPayrollSummary,
  mockFundResponse,
  mockPayrollCycles,
  mockApiResponse,
  mockApiError,
  delay,
} from "./mock-data";
import type {
  OutsourcedDashboard,
  EmployeeOutsourced,
  BankCodesResponse,
  PayrollOutsourcedConfiguration,
  WalletBalance,
  WalletTransactionHistory,
  PayrollOutsourcedSummary,
  OutsourcedWalletFundRequest,
  OutsourcedWalletFundResponse,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  LoginRequest,
  LoginResponse,
  Setup2FARequest,
  Setup2FAResponse,
  Verify2FARequest,
  Verify2FAResponse,
  Company,
  CompanyLocation,
  UpdateCompanyLocation,
  CreateCompanyLocation,
  Employee,
  CreateEmployee,
  UpdateEmployee,
  UpdateEmployeeRole,
  TimesheetCreate,
  TimesheetUpdate,
  UpdateCompany,
} from "./types";
import { subDays } from "date-fns";

// Environment flag to toggle between mock and real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Mock storage for dynamic data
let mockEmployeeData = [...mockEmployees];
let mockDashboardData = { ...mockDashboard };
let mockWalletData = { ...mockWalletBalance };
let mockConfigData = mockPayrollConfig;

// API Functions
const registerCompany = async (
  data: RegisterCompanyRequest
): Promise<RegisterCompanyResponse> => {
  const response = await api.post("/api/companies/register", data);
  return response.data;
};

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

const setup2FA = async (data: Setup2FARequest): Promise<Setup2FAResponse> => {
  const response = await api.post("/api/auth/2fa/setup", data);
  return response.data;
};

const verify2FA = async (
  data: Verify2FARequest
): Promise<Verify2FAResponse> => {
  const response = await api.post("/api/auth/2fa/setup/verify", data);
  return response.data;
};

const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
  // Import and use the client-side cookie clearing function
  const { clearAuthCookiesClient } = require("./auth-utils");
  clearAuthCookiesClient();
};

// Authentication hooks
export const useRegisterCompany = () => {
  return useMutation<RegisterCompanyResponse, Error, RegisterCompanyRequest>({
    mutationFn: registerCompany,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.session_token) {
        // Store session info if needed (though cookies should handle this)
        queryClient.setQueryData(["auth", "user"], data.user);

        // Invalidate the auth query to force a refresh of auth state
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });
};

export const useSetup2FA = () => {
  return useMutation<Setup2FAResponse, Error, Setup2FARequest>({
    mutationFn: setup2FA,
  });
};

export const useVerify2FA = () => {
  const queryClient = useQueryClient();

  return useMutation<Verify2FAResponse, Error, Verify2FARequest>({
    mutationFn: verify2FA,
    onSuccess: (data) => {
      if (data.setup_complete) {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      // Redirect will be handled by axios interceptor
    },
  });
};

// Utility function to handle authentication errors
export const handleAuthError = (error: any): string => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === "string") {
      return detail;
    } else if (detail.message) {
      return detail.message;
    }
  }
  return error.message || "An authentication error occurred";
};

// Dashboard hooks
export const useOutsourcedDashboard = () => {
  return useQuery<OutsourcedDashboard>({
    queryKey: ["outsourced", "dashboard"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Update dashboard based on current employee data
        const activeEmployees = mockEmployeeData.filter((emp) => emp.isActive);
        mockDashboardData.totalEmployees = mockEmployeeData.length;
        mockDashboardData.activeEmployees = activeEmployees.length;
        return mockApiResponse(mockDashboardData);
      }
      return api
        .get("/api/outsourced/dashboard")
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          return data;
        });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Employee hooks
export const useOutsourcedEmployees = (includeInactive = false) => {
  return useQuery<EmployeeOutsourced[]>({
    queryKey: ["outsourced", "employees", includeInactive],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        let employees = [...mockEmployeeData];
        if (!includeInactive) {
          employees = employees.filter((emp) => emp.isActive);
        }
        return mockApiResponse(employees);
      }
      return api
        .get(`/api/outsourced/employees?include_inactive=${includeInactive}`)
        .then((res) => res.data);
    },
  });
};

export const useBankCodes = () => {
  return useQuery<BankCodesResponse>({
    queryKey: ["outsourced", "bank-codes"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockApiResponse(mockBankCodes);
      }
      return api.get("/api/outsourced/bank-codes").then((res) => res.data);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Pick<EmployeeOutsourced, "accountNumber" | "amount" | "bankCode">
    ) => {
      if (USE_MOCK_DATA) {
        await delay(1000); // Simulate API delay

        // Check for duplicate account numbers
        const exists = mockEmployeeData.find(
          (emp) => emp.accountNumber === data.accountNumber
        );
        if (exists) {
          mockApiError("Account number already exists");
        }

        // Validate bank code
        const validBankCode = mockBankCodes.bankCodes.find(
          (bank) => bank.code === data.bankCode
        );
        if (!validBankCode) {
          mockApiError("Invalid bank code");
        }

        const newEmployee: EmployeeOutsourced = {
          id: `emp_${Date.now()}`,
          accountNumber: data.accountNumber,
          amount: data.amount,
          bankCode: data.bankCode,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyId: "comp_001",
        };

        mockEmployeeData.push(newEmployee);
        return mockApiResponse(newEmployee);
      }

      return api.post("/api/outsourced/employees", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "employees"] });
      queryClient.invalidateQueries({ queryKey: ["outsourced", "dashboard"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<EmployeeOutsourced> & { id: string }) => {
      if (USE_MOCK_DATA) {
        await delay(800);

        const employeeIndex = mockEmployeeData.findIndex(
          (emp) => emp.id === id
        );
        if (employeeIndex === -1) {
          mockApiError("Employee not found", 404);
        }

        // Check for duplicate account numbers (excluding current employee)
        if (data.accountNumber) {
          const exists = mockEmployeeData.find(
            (emp) => emp.accountNumber === data.accountNumber && emp.id !== id
          );
          if (exists) {
            mockApiError("Account number already exists");
          }
        }

        mockEmployeeData[employeeIndex] = {
          ...mockEmployeeData[employeeIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        return mockApiResponse(mockEmployeeData[employeeIndex]);
      }

      return api.put(`/api/outsourced/employees/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await delay(600);

        const employeeIndex = mockEmployeeData.findIndex(
          (emp) => emp.id === id
        );
        if (employeeIndex === -1) {
          mockApiError("Employee not found", 404);
        }

        mockEmployeeData.splice(employeeIndex, 1);
        return mockApiResponse({ success: true });
      }

      return api.delete(`/api/outsourced/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "employees"] });
      queryClient.invalidateQueries({ queryKey: ["outsourced", "dashboard"] });
    },
  });
};

export const useBulkUploadEmployees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (USE_MOCK_DATA) {
        await delay(2000); // Simulate file processing time

        // Read and parse CSV file
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          mockApiError("CSV file must contain at least one data row");
        }

        const header = lines[0].toLowerCase();
        if (
          !header.includes("account_number") ||
          !header.includes("amount") ||
          !header.includes("bank_code")
        ) {
          mockApiError(
            "CSV must have columns: account_number, amount, bank_code"
          );
        }

        const errors: string[] = [];
        const newEmployees: EmployeeOutsourced[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const values = line.split(",").map((v) => v.trim());

          if (values.length !== 3) {
            errors.push(`Row ${i + 1}: Must have exactly 3 columns`);
            continue;
          }

          const [accountNumber, amountStr, bankCode] = values;
          const amount = parseInt(amountStr);

          // Validations
          if (!accountNumber || accountNumber.length < 8) {
            errors.push(`Row ${i + 1}: Invalid account number`);
            continue;
          }

          if (isNaN(amount) || amount <= 0) {
            errors.push(`Row ${i + 1}: Invalid amount`);
            continue;
          }

          const validBankCode = mockBankCodes.bankCodes.find(
            (bank) => bank.code === bankCode
          );
          if (!validBankCode) {
            errors.push(`Row ${i + 1}: Invalid bank code ${bankCode}`);
            continue;
          }

          // Check for duplicates in existing data
          const exists = mockEmployeeData.find(
            (emp) => emp.accountNumber === accountNumber
          );
          if (exists) {
            errors.push(
              `Row ${i + 1}: Account number ${accountNumber} already exists`
            );
            continue;
          }

          // Check for duplicates within the upload
          const duplicate = newEmployees.find(
            (emp) => emp.accountNumber === accountNumber
          );
          if (duplicate) {
            errors.push(
              `Row ${
                i + 1
              }: Duplicate account number ${accountNumber} in upload`
            );
            continue;
          }

          newEmployees.push({
            id: `emp_${Date.now()}_${i}`,
            accountNumber,
            amount,
            bankCode,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyId: "comp_001",
          });
        }

        if (errors.length > 0) {
          const error = new Error("Upload validation failed") as any;
          error.response = {
            status: 400,
            data: { detail: { message: "Upload validation failed", errors } },
          };
          throw error;
        }

        // Add new employees to mock data
        mockEmployeeData.push(...newEmployees);

        return mockApiResponse({
          message: `Successfully uploaded ${newEmployees.length} employees`,
          count: newEmployees.length,
        });
      }

      const formData = new FormData();
      formData.append("file", file);
      return api.post("/api/outsourced/employees/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "employees"] });
      queryClient.invalidateQueries({ queryKey: ["outsourced", "dashboard"] });
    },
  });
};

// Payroll Configuration hooks
export const usePayrollConfig = () => {
  return useQuery<PayrollOutsourcedConfiguration>({
    queryKey: ["outsourced", "payroll", "config"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockConfigData
          ? mockApiResponse(mockConfigData)
          : mockApiError("No configuration found", 404);
      }
      return api.get("/api/outsourced/payroll/config").then((res) => res.data);
    },
  });
};

export const useCreatePayrollConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<
        PayrollOutsourcedConfiguration,
        "id" | "createdAt" | "updatedAt" | "companyId"
      >
    ) => {
      if (USE_MOCK_DATA) {
        await delay(1000);

        mockConfigData = {
          id: `config_${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyId: "comp_001",
        };

        return mockApiResponse(mockConfigData);
      }

      return api.post("/api/outsourced/payroll/config", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outsourced", "payroll", "config"],
      });
    },
  });
};

// Wallet hooks

// create useWallet hook if it exists we will be able to get a response, if it does not we will use a post request to create one
export const useWallet = () => {
  return useQuery<WalletBalance>({
    queryKey: ["outsourced", "wallet"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockApiResponse(mockWalletData);
      }
      return api.get("/api/outsourced/wallet").then((res) => res.data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// create wallet hook using useQuery
export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<WalletBalance, Error>({
    mutationFn: async () => {
      if (USE_MOCK_DATA) {
        await delay(1000); // Simulate API delay
        // Check if wallet already exists
        if (mockWalletData) {
          mockApiError("Wallet already exists");
        }
        // Create a new wallet
        mockWalletData = {
          wallet_id: `wallet_${Date.now()}`,
          balance: 0,
          currency: "KES",
          wallet_type: "MPESA",
          last_updated: new Date().toISOString(),
          wallet: null,
          exists: true,
        };
        return mockApiResponse(mockWalletData);
      }
      return api.post("/api/outsourced/wallet").then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "wallet"] });
    },
  });
};

export const useWalletBalance = () => {
  return useQuery<WalletBalance>({
    queryKey: ["outsourced", "wallet", "balance"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockApiResponse(mockWalletData);
      }
      return api.get("/api/outsourced/wallet/balance").then((res) => res.data);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useWalletTransactions = (limit = 20, offset = 0) => {
  return useQuery<WalletTransactionHistory>({
    queryKey: ["outsourced", "wallet", "transactions", limit, offset],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockApiResponse(mockWalletTransactions);
      }
      return api
        .get(
          `/api/outsourced/wallet/transactions?limit=${limit}&offset=${offset}`
        )
        .then((res) => res.data);
    },
  });
};

export const useFundWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<
    OutsourcedWalletFundResponse,
    Error,
    OutsourcedWalletFundRequest
  >({
    mutationFn: async (data) => {
      if (USE_MOCK_DATA) {
        await delay(1500);

        if (data.amount <= 0) {
          mockApiError("Amount must be greater than 0");
        }

        if (data.payment_method === "mpesa" && !data.customer_phone) {
          mockApiError("Phone number is required for M-PESA payments");
        }

        const response: OutsourcedWalletFundResponse = {
          ...mockFundResponse,
          amount: data.amount,
          reference: `FUND_REF_${Date.now()}`,
          payment_method: data.payment_method,
          payment_instructions: {
            ...mockFundResponse.payment_instructions,
            amount: data.amount,
            reference: `FUND_REF_${Date.now()}`,
            method: data.payment_method,
          },
        };

        if (data.payment_method === "mpesa") {
          response.payment_instructions = {
            method: "mpesa",
            reference: response.reference,
            amount: data.amount,
            note: "Check your phone for M-PESA prompt",
          };
        }

        return mockApiResponse(response);
      }

      return api
        .post("/api/outsourced/wallet/fund", data)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "wallet"] });
    },
  });
};

export const useConfirmBankTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      reference: string;
      bank_transaction_reference: string;
      amount: number;
      payment_date?: string;
    }) => {
      if (USE_MOCK_DATA) {
        await delay(1200);

        if (!data.reference || !data.bank_transaction_reference) {
          mockApiError("Reference and bank transaction reference are required");
        }

        return mockApiResponse({
          message: "Transfer confirmation received. Pending admin approval.",
          status: "pending_approval",
          reference: data.reference,
        });
      }

      return api.post("/api/outsourced/wallet/confirm-bank-transfer", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "wallet"] });
    },
  });
};

export const useApproveBankTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { reference: string }) => {
      if (USE_MOCK_DATA) {
        await delay(1000);

        if (!data.reference) {
          mockApiError("Reference is required");
        }

        // Simulate successful approval
        mockWalletData.balance += 50000; // Assume fixed amount for mock
        mockWalletData.last_updated = new Date().toISOString();

        return mockApiResponse({
          message: "Bank transfer approved and wallet credited successfully",
          wallet_balance: mockWalletData.balance,
          reference: data.reference,
        });
      }

      return api.post("/api/outsourced/wallet/approve-bank-transfer", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "wallet"] });
    },
  });
};

export const useVerifyMpesaTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      mpesa_transaction_code: string;
      amount?: number;
    }) => {
      if (USE_MOCK_DATA) {
        await delay(2000); // Simulate M-PESA verification time

        if (
          !data.mpesa_transaction_code ||
          data.mpesa_transaction_code.length !== 10
        ) {
          mockApiError("Invalid M-PESA transaction code");
        }

        // Simulate successful verification
        const creditAmount = data.amount || 50000;
        mockWalletData.balance += creditAmount;
        mockWalletData.last_updated = new Date().toISOString();

        return mockApiResponse({
          success: true,
          transaction_code: data.mpesa_transaction_code,
          amount: creditAmount,
          wallet_balance: mockWalletData.balance,
          message: "Transaction verified and wallet credited successfully",
          transaction_id: `txn_${Date.now()}`,
        });
      }

      return api.post("/api/outsourced/wallet/verify-transaction", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "wallet"] });
    },
  });
};

// Payroll Summary hooks
export const usePayrollSummary = () => {
  return useQuery<PayrollOutsourcedSummary>({
    queryKey: ["outsourced", "payroll", "summary"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Calculate summary based on current active employees
        const activeEmployees = mockEmployeeData.filter((emp) => emp.isActive);

        if (activeEmployees.length === 0) {
          return mockApiResponse({
            employeeCount: 0,
            totalGrossPay: 0,
            totalNetPay: 0,
            totalPayeTax: 0,
            totalKaziniHRFees: 0,
            totalDisbursementAmount: 0,
            breakdown: [],
            kazinihrAccount: mockPayrollSummary.kazinihrAccount,
          });
        }

        const breakdown = activeEmployees.map((emp) => {
          const grossPay = emp.amount;
          const payeTax = Math.round(grossPay * 0.2); // 20% PAYE
          const netPay = grossPay - payeTax;
          const kazinihrFee = Math.round(netPay * 0.02); // 2% fee

          return {
            employeeId: emp.id,
            accountNumber: emp.accountNumber,
            bankCode: emp.bankCode,
            grossPay,
            payeTax,
            netPay,
            kazinihrFee,
          };
        });

        const totals = breakdown.reduce(
          (acc, emp) => ({
            totalGrossPay: acc.totalGrossPay + emp.grossPay,
            totalNetPay: acc.totalNetPay + emp.netPay,
            totalPayeTax: acc.totalPayeTax + emp.payeTax,
            totalKaziniHRFees: acc.totalKaziniHRFees + emp.kazinihrFee,
          }),
          {
            totalGrossPay: 0,
            totalNetPay: 0,
            totalPayeTax: 0,
            totalKaziniHRFees: 0,
          }
        );

        const summary: PayrollOutsourcedSummary = {
          employeeCount: activeEmployees.length,
          ...totals,
          totalDisbursementAmount:
            totals.totalNetPay + totals.totalKaziniHRFees,
          breakdown,
          kazinihrAccount: mockPayrollSummary.kazinihrAccount,
        };

        return mockApiResponse(summary);
      }

      return api.get("/api/outsourced/payroll/summary").then((res) => res.data);
    },
  });
};

export const useProcessPayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data?: { run_date?: string }) => {
      if (USE_MOCK_DATA) {
        await delay(3000); // Simulate processing time

        const activeEmployees = mockEmployeeData.filter((emp) => emp.isActive);
        if (activeEmployees.length === 0) {
          mockApiError("No active employees to process payroll for");
        }

        // Simulate successful processing
        const newCycle = {
          id: `cycle_${Date.now()}`,
          cycleCount: mockPayrollCycles.length + 1,
          runDate: data?.run_date || new Date().toISOString().split("T")[0],
          employeeCount: activeEmployees.length,
          hasRun: true,
          completed: false,
          status: "PROCESSED",
        };

        mockPayrollCycles.push(newCycle as any);

        return mockApiResponse({
          message: "Payroll processed successfully",
          cycle: newCycle,
          records: activeEmployees.length,
        });
      }

      return api.post("/api/outsourced/payroll/process", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "payroll"] });
      queryClient.invalidateQueries({ queryKey: ["outsourced", "dashboard"] });
    },
  });
};

// Reports hooks (using mock data from reports page)
export const usePayrollCycles = (limit = 10) => {
  return useQuery({
    queryKey: ["outsourced", "payroll", "cycles", limit],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockApiResponse(mockPayrollCycles.slice(0, limit));
      }
      return api
        .get(`/api/outsourced/payroll/reports?limit=${limit}`)
        .then((res) => res.data);
    },
  });
};

export const usePayrollCycleReport = (cycleId: string) => {
  return useQuery({
    queryKey: ["outsourced", "payroll", "reports", cycleId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const cycle = mockPayrollCycles.find((c) => c.id === cycleId);
        if (!cycle) {
          mockApiError("Payroll cycle not found", 404);
        }
        return mockApiResponse(cycle);
      }
      return api
        .get(`/api/outsourced/payroll/reports/${cycleId}`)
        .then((res) => res.data);
    },
    enabled: !!cycleId,
  });
};

// create hook for useDisbursePayroll using this endpoint /api/outsourced/payroll/disburse/{cycle_id}
export const useDisbursePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cycleId: string) => {
      if (USE_MOCK_DATA) {
        await delay(2000); // Simulate disbursement time

        const cycle = mockPayrollCycles.find((c) => c.id === cycleId);
        if (!cycle) {
          mockApiError("Payroll cycle not found", 404);
        } else {
          // Simulate successful disbursement
          cycle.completed = true;
          cycle.status = "DISBURSED";
        }

        return mockApiResponse({
          message: "Payroll disbursed successfully",
          cycle,
        });
      }

      return api.post(`/api/outsourced/payroll/disburse/${cycleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outsourced", "payroll"] });
      queryClient.invalidateQueries({ queryKey: ["outsourced", "dashboard"] });
    },
  });
};

export function useTimesheets(companyId: string) {
  const queryClient = useQueryClient();

  const updateTimesheet = useMutation({
    mutationFn: async (timesheet: TimesheetUpdate[]) => {
      await api.patch("/api/companies/" + companyId + "/timesheets", timesheet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timesheets"],
      });
    },
    onError: (error) => {
      console.error("Error updating timesheet:", error);
    },
  });

  const addTimesheet = useMutation({
    mutationFn: async (timesheet: TimesheetCreate[]) => {
      await api.post("/api/companies/" + companyId + "/timesheets", timesheet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timesheets"],
      });
    },
    onError: (error) => {
      console.error("Error adding timesheet:", error);
    },
  });

  const getTimesheets = (searchParams: any) =>
    useQuery({
      queryKey: ["timesheets", searchParams],
      queryFn: () =>
        api
          .post(
            "/api/companies/" + companyId + "/timesheets/search",
            searchParams
          )
          .then((res) => res.data),
      enabled: false,
    });

  const getActiveTimesheets = (locationId: string) => {
    const today = new Date();
    const lastWeek = subDays(today, 7);

    return useInfiniteQuery({
      queryKey: ["timesheets", "active", locationId],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await api.post(
          `/api/companies/${companyId}/timesheets/search`,
          {
            pagination: { page: pageParam, limit: 100 },
            filters: {
              startDate: lastWeek.toISOString(),
              endDate: today.toISOString(),
              activeShift: true,
              companyLocationIds: [locationId],
            },
          }
        );
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.has_next ? lastPage.page + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: false,
    });
  };

  return {
    getTimesheets,
    addTimesheet,
    updateTimesheet,
    getActiveTimesheets,
  };
}

export function useCompany() {
  const queryClient = useQueryClient();

  const getCompany = useQuery<Company>({
    queryKey: ["company"],
    queryFn: () =>
      api.get("/api/companies").then((res) => {
        return res.data?.[0];
      }),
  });

  const updateCompany = useMutation({
    mutationFn: async (updatedCompany: UpdateCompany) => {
      const { id, ...data } = updatedCompany;
      await api.put("/api/companies/" + id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (error) => {
      console.error("Error updating company:", error);
    },
  });

  return {
    getCompany,
    updateCompany,
  };
}

export function useCompanyLocations(companyId: string) {
  const queryClient = useQueryClient();

  const addCompanyLocation = useMutation({
    mutationFn: async (location: CreateCompanyLocation) => {
      const res = await api.post(
        "/api/companies/" + companyId + "/locations",
        location
      );
      return res.data.data as CompanyLocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", companyId, "locations"],
      });
    },
    onError: (error) => {
      console.error("Error adding company location:", error);
    },
  });

  const updateCompanyLocation = useMutation({
    mutationFn: async (location: UpdateCompanyLocation) => {
      const res = await api.put(
        "/api/companies/" + companyId + "/locations/" + location.id,
        location
      );
      return res.data.data as CompanyLocation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", companyId, "locations"],
      });
    },
    onError: (error) => {
      console.error("Error updating company location:", error);
    },
  });

  const getCompanyLocations = useQuery<CompanyLocation[]>({
    queryKey: ["company", companyId, "locations"],
    queryFn: () =>
      api
        .get("/api/companies/" + companyId + "/locations")
        .then((res) => res.data.data),
  });

  return {
    getCompanyLocations,
    addCompanyLocation,
    updateCompanyLocation,
  };
}

export function useEmployees(companyId: string) {
  const queryClient = useQueryClient();

  const getEmployees = useQuery<Employee[]>({
    queryKey: ["company", companyId, "employees"],
    queryFn: () =>
      api
        .get("/api/companies/" + companyId + "/employees")
        .then((res) => res.data.data),
  });

  const addEmployee = useMutation({
    mutationFn: async (employee: CreateEmployee) => {
      const res = await api.post(
        "/api/companies/" + companyId + "/employees",
        employee
      );
      return res.data.data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", companyId, "employees"],
      });
    },
    onError: (error) => {
      console.error("Error adding employee:", error);
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async (employee: UpdateEmployee) => {
      const res = await api.put(
        "/api/companies/" + companyId + "/employees/" + employee.id,
        employee
      );
      return res.data.data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", companyId, "employees"],
      });
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
    },
  });

  const updateEmployeeRoles = useMutation({
    mutationFn: async (employee: UpdateEmployeeRole) => {
      const res = await api.put(
        "/api/companies/" + companyId + "/employees/" + employee.id + "/role",
        employee
      );
      return res.data.data as Employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", companyId, "employees"],
      });
    },
    onError: (error) => {
      console.error("Error updating employee roles:", error);
    },
  });

  return {
    getEmployees,
    addEmployee,
    updateEmployee,
    updateEmployeeRoles,
  };
}

// Utils for error handling (keep existing)
export const handleApiError = (error: any): string => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === "string") {
      return detail;
    } else if (detail.errors && Array.isArray(detail.errors)) {
      return detail.errors.join(", ");
    } else if (detail.message) {
      return detail.message;
    }
  }
  return error.message || "An unexpected error occurred";
};
