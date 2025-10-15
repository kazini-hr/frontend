import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Admin Dashboard Types
export interface AdminDashboardStats {
  total_companies: number;
  active_companies: number;
  total_users: number;
  users_by_role: {
    SUPER_ADMIN: number;
    COMPANY_ADMIN: number;
    EMPLOYEE: number;
  };
  active_subscriptions: number;
  outsourced_companies: number;
  recent_payroll_cycles: number;
  total_wallet_balance: number;
  monthly_disbursements: number;
  total_disbursement_batches: number;
}

export interface CompanyOverview {
  id: string;
  name: string;
  company_pin: string;
  industry: string;
  size: string;
  is_active: boolean;
  subscription_status: string;
  total_employees: number;
  wallet_balance: number;
  last_payroll_date: string | null;
  admin_name: string;
  admin_email: string;
  created_at: string;
}

export interface WebhookMonitoring {
  id: string;
  webhook_type: string;
  endpoint: string;
  status: string;
  attempts: number;
  last_attempt: string;
  response_status: number | null;
  error_message: string | null;
  company_name: string;
  created_at: string;
}

// Admin Dashboard Hooks
export const useAdminDashboardStats = () => {
  return useQuery<AdminDashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => api.get('/api/admin/dashboard/stats').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompaniesOverview = (params: {
  limit?: number;
  offset?: number;
  search?: string;
  is_active?: boolean;
  has_subscription?: boolean;
} = {}) => {
  return useQuery<{ companies: CompanyOverview[]; total: number }>({
    queryKey: ['admin', 'companies', 'overview', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      return api.get(`/api/admin/companies/overview?${searchParams}`).then(res => res.data);
    },
  });
};

export const useWebhookMonitoring = (params: {
  limit?: number;
  webhook_type?: string;
  status?: string;
  hours?: number;
} = {}) => {
  return useQuery<{ webhooks: WebhookMonitoring[]; total: number }>({
    queryKey: ['admin', 'webhooks', 'monitoring', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      return api.get(`/api/admin/webhooks/monitoring?${searchParams}`).then(res => res.data);
    },
  });
};

export const useWebhookStats = (hours = 24) => {
  return useQuery({
    queryKey: ['admin', 'webhooks', 'stats', hours],
    queryFn: () => api.get(`/api/admin/webhooks/stats?hours=${hours}`).then(res => res.data),
  });
};

// Company Management Hooks
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/api/admin/companies/register', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/api/admin/users/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Tax Administration Hooks
export const useTaxRates = () => {
  return useQuery({
    queryKey: ['admin', 'tax', 'rates'],
    queryFn: () => api.get('/api/admin/tax/rates/current').then(res => res.data),
  });
};

export const useUploadTaxRates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileType, file }: { fileType: string; file: File }) => {
      const formData = new FormData();
      formData.append('file_type', fileType);
      formData.append('file', file);
      return api.post('/api/admin/tax/rates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tax'] });
    },
  });
};

export const useClearTaxCache = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/api/admin/tax/rates/clear-cache'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tax'] });
    },
  });
};

// Email Monitoring Hooks
export interface EmailMonitoring {
  id: string;
  email_type: string;
  recipient: string;
  subject: string;
  status: string;
  provider: string;
  sent_at: string;
  delivered_at: string | null;
  company_name: string;
}

export const useEmailMonitoring = (params: {
  limit?: number;
  email_type?: string;
  status?: string;
  hours?: number;
} = {}) => {
  return useQuery<{ emails: EmailMonitoring[]; total: number }>({
    queryKey: ['admin', 'emails', 'monitoring', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      return api.get(`/api/admin/emails/monitoring?${searchParams}`).then(res => res.data);
    },
  });
};

export const useResendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emailId: string) => api.post(`/api/admin/emails/${emailId}/resend`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'emails'] });
    },
  });
};

export const useBulkResendEmails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emailIds: string[]) => api.post('/api/admin/emails/bulk-resend', { email_ids: emailIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'emails'] });
    },
  });
};

// System Health Hook
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['admin', 'system', 'health'],
    queryFn: () => api.get('/api/admin/system/health').then(res => res.data),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Webhook Actions
export const useReplayWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (monitoringId: string) => api.post(`/api/admin/webhooks/${monitoringId}/replay`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'webhooks'] });
    },
  });
};

export const useTestWebhook = () => {
  return useMutation({
    mutationFn: (data: { webhook_type: string; endpoint: string; test_payload?: any }) => 
      api.post('/api/admin/webhooks/test-trigger', data),
  });
};

// Error handling utility
export const handleAdminApiError = (error: any): string => {
  if (error.response?.status === 403) {
    return 'Insufficient permissions to perform this action';
  }
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') {
      return detail;
    } else if (detail.errors && Array.isArray(detail.errors)) {
      return detail.errors.join(', ');
    } else if (detail.message) {
      return detail.message;
    }
  }
  return 'An unexpected error occurred';
};