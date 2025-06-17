// lib/kazini-api.ts
// Complete Kazini HR API client implementation based on common HR API patterns

import { useState } from "react"

const KAZINI_API_BASE = 'https://api.kazinihr.co.ke'

// API Response types based on typical HR API structures
interface KaziniApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Employee-related types
interface KaziniEmployee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  department: string
  position: string
  hire_date: string
  status: 'active' | 'inactive' | 'terminated'
  salary?: number
  manager_id?: string
  location?: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern'
  created_at: string
  updated_at: string
}

// Payroll calculation types (from your requirements)
interface PayrollCalculationParams {
  basic_salary: number
  income_period: 'monthly' | 'annual'
  currency: string
  allowances: number
  include_nhif: boolean
  include_nssf: boolean
  include_housing_levy: boolean
  is_pensionable: boolean
  has_disability_exemption: boolean
}

interface PayrollCalculationResult {
  basic_salary: number
  allowances: number
  gross_salary: number
  paye: number
  nhif: number
  nssf: number
  housing_levy: number
  total_deductions: number
  net_salary: number
  calculation_date: string
  tax_year: string
}

// Leave management types
interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  days_requested: number
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  comments?: string
  created_at: string
  updated_at: string
}

// Attendance types
interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  clock_in?: string
  clock_out?: string
  break_start?: string
  break_end?: string
  total_hours: number
  status: 'present' | 'absent' | 'late' | 'half_day'
  notes?: string
}

// Department types
interface Department {
  id: string
  name: string
  description?: string
  manager_id?: string
  budget?: number
  created_at: string
  updated_at: string
}

// Position/Job types
interface Position {
  id: string
  title: string
  department_id: string
  description?: string
  requirements?: string[]
  salary_range_min?: number
  salary_range_max?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

class KaziniHRClient {
  private baseURL: string
  private apiKey?: string
  private authToken?: string

  constructor(options: { baseURL?: string; apiKey?: string; authToken?: string } = {}) {
    this.baseURL = options.baseURL || KAZINI_API_BASE
    this.apiKey = options.apiKey
    this.authToken = options.authToken
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    params?: Record<string, any>
  ): Promise<KaziniApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    
    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Add authentication headers
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey
    }
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data && ['POST', 'PUT'].includes(method)) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url.toString(), config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Kazini API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.makeRequest<{ token: string; user: any }>(
      '/auth/login',
      'POST',
      { email, password }
    )
    
    if (response.success && response.data.token) {
      this.authToken = response.data.token
    }
    
    return response.data
  }

  async logout(): Promise<void> {
    await this.makeRequest('/auth/logout', 'POST')
    this.authToken = undefined
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.makeRequest<{ token: string }>('/auth/refresh', 'POST')
    if (response.success && response.data.token) {
      this.authToken = response.data.token
    }
    return response.data
  }

  // Employee endpoints
  async getEmployees(params?: {
    page?: number
    limit?: number
    department?: string
    status?: string
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<KaziniEmployee[]> {
    const response = await this.makeRequest<KaziniEmployee[]>('/employees', 'GET', null, params)
    return response.data
  }

  async getEmployee(id: string): Promise<KaziniEmployee> {
    const response = await this.makeRequest<KaziniEmployee>(`/employees/${id}`)
    return response.data
  }

  async createEmployee(employeeData: Omit<KaziniEmployee, 'id' | 'created_at' | 'updated_at'>): Promise<KaziniEmployee> {
    const response = await this.makeRequest<KaziniEmployee>('/employees', 'POST', employeeData)
    return response.data
  }

  async updateEmployee(id: string, updates: Partial<KaziniEmployee>): Promise<KaziniEmployee> {
    const response = await this.makeRequest<KaziniEmployee>(`/employees/${id}`, 'PUT', updates)
    return response.data
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.makeRequest(`/employees/${id}`, 'DELETE')
  }

  async bulkUpdateEmployees(employeeIds: string[], updates: Partial<KaziniEmployee>): Promise<{ updated_count: number }> {
    const response = await this.makeRequest<{ updated_count: number }>(
      '/employees/bulk-update',
      'POST',
      { employee_ids: employeeIds, updates }
    )
    return response.data
  }

  // Payroll endpoints (from your requirements)
  async calculatePayroll(params: PayrollCalculationParams): Promise<PayrollCalculationResult> {
    const response = await this.makeRequest<PayrollCalculationResult>(
      '/api/payroll/calculate/public',
      'GET',
      null,
      params
    )
    return response.data
  }

  async getPayrollHistory(employeeId: string, params?: {
    year?: number
    month?: number
    limit?: number
  }): Promise<PayrollCalculationResult[]> {
    const response = await this.makeRequest<PayrollCalculationResult[]>(
      `/employees/${employeeId}/payroll-history`,
      'GET',
      null,
      params
    )
    return response.data
  }

  async processPayroll(employeeIds: string[], payPeriod: string): Promise<{ processed_count: number }> {
    const response = await this.makeRequest<{ processed_count: number }>(
      '/payroll/process',
      'POST',
      { employee_ids: employeeIds, pay_period: payPeriod }
    )
    return response.data
  }

  // Leave management endpoints
  async getLeaveRequests(params?: {
    employee_id?: string
    status?: string
    start_date?: string
    end_date?: string
    page?: number
    limit?: number
  }): Promise<LeaveRequest[]> {
    const response = await this.makeRequest<LeaveRequest[]>('/leave-requests', 'GET', null, params)
    return response.data
  }

  async createLeaveRequest(leaveData: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>): Promise<LeaveRequest> {
    const response = await this.makeRequest<LeaveRequest>('/leave-requests', 'POST', leaveData)
    return response.data
  }

  async approveLeaveRequest(id: string, comments?: string): Promise<LeaveRequest> {
    const response = await this.makeRequest<LeaveRequest>(
      `/leave-requests/${id}/approve`,
      'POST',
      { comments }
    )
    return response.data
  }

  async rejectLeaveRequest(id: string, reason: string): Promise<LeaveRequest> {
    const response = await this.makeRequest<LeaveRequest>(
      `/leave-requests/${id}/reject`,
      'POST',
      { reason }
    )
    return response.data
  }

  async getLeaveBalance(employeeId: string): Promise<{
    annual: number
    sick: number
    personal: number
    maternity?: number
    paternity?: number
  }> {
    const response = await this.makeRequest<any>(`/employees/${employeeId}/leave-balance`)
    return response.data
  }

  // Attendance endpoints
  async getAttendance(params?: {
    employee_id?: string
    date?: string
    start_date?: string
    end_date?: string
    page?: number
    limit?: number
  }): Promise<AttendanceRecord[]> {
    const response = await this.makeRequest<AttendanceRecord[]>('/attendance', 'GET', null, params)
    return response.data
  }

  async clockIn(employeeId: string, timestamp?: string): Promise<AttendanceRecord> {
    const response = await this.makeRequest<AttendanceRecord>(
      '/attendance/clock-in',
      'POST',
      { employee_id: employeeId, timestamp: timestamp || new Date().toISOString() }
    )
    return response.data
  }

  async clockOut(employeeId: string, timestamp?: string): Promise<AttendanceRecord> {
    const response = await this.makeRequest<AttendanceRecord>(
      '/attendance/clock-out',
      'POST',
      { employee_id: employeeId, timestamp: timestamp || new Date().toISOString() }
    )
    return response.data
  }

  async updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await this.makeRequest<AttendanceRecord>(`/attendance/${id}`, 'PUT', updates)
    return response.data
  }

  // Department endpoints
  async getDepartments(): Promise<Department[]> {
    const response = await this.makeRequest<Department[]>('/departments')
    return response.data
  }

  async createDepartment(departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const response = await this.makeRequest<Department>('/departments', 'POST', departmentData)
    return response.data
  }

  async updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
    const response = await this.makeRequest<Department>(`/departments/${id}`, 'PUT', updates)
    return response.data
  }

  // Position endpoints
  async getPositions(departmentId?: string): Promise<Position[]> {
    const params = departmentId ? { department_id: departmentId } : undefined
    const response = await this.makeRequest<Position[]>('/positions', 'GET', null, params)
    return response.data
  }

  async createPosition(positionData: Omit<Position, 'id' | 'created_at' | 'updated_at'>): Promise<Position> {
    const response = await this.makeRequest<Position>('/positions', 'POST', positionData)
    return response.data
  }

  // Analytics and reporting endpoints
  async getDashboardStats(): Promise<{
    total_employees: number
    active_employees: number
    pending_leave_requests: number
    attendance_rate: number
    payroll_cost: number
  }> {
    const response = await this.makeRequest<any>('/analytics/dashboard')
    return response.data
  }

  async getEmployeeReport(params: {
    type: 'attendance' | 'payroll' | 'performance'
    employee_id?: string
    start_date: string
    end_date: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<any> {
    const response = await this.makeRequest<any>('/reports/employees', 'GET', null, params)
    return response.data
  }

  async getDepartmentReport(departmentId: string, params?: {
    start_date?: string
    end_date?: string
    metrics?: string[]
  }): Promise<any> {
    const response = await this.makeRequest<any>(`/reports/departments/${departmentId}`, 'GET', null, params)
    return response.data
  }

  // File upload endpoints
  async uploadEmployeeDocument(employeeId: string, file: File, documentType: string): Promise<{
    id: string
    filename: string
    url: string
  }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', documentType)

    const response = await fetch(`${this.baseURL}/employees/${employeeId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': this.authToken ? `Bearer ${this.authToken}` : '',
        'X-API-Key': this.apiKey || '',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data
  }

  // Webhook endpoints for real-time updates
  async registerWebhook(url: string, events: string[]): Promise<{ webhook_id: string }> {
    const response = await this.makeRequest<{ webhook_id: string }>(
      '/webhooks',
      'POST',
      { url, events }
    )
    return response.data
  }
}

// Utility functions for common operations
export class KaziniUtils {
  static formatKenyanCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  static calculateWorkingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    let workingDays = 0
    
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        workingDays++
      }
    }
    
    return workingDays
  }

  static validateKenyanPhoneNumber(phone: string): boolean {
    // Kenyan phone number validation
    const kenyanPhoneRegex = /^(\+254|254|0)([71][\d]{8})$/
    return kenyanPhoneRegex.test(phone.replace(/\s+/g, ''))
  }

  static validateKenyanEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static generateEmployeeId(prefix: string = 'EMP'): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 3).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }
}

// React hook for using Kazini API
export function useKaziniAPI(options?: { apiKey?: string; authToken?: string }) {
  const [client] = useState(() => new KaziniHRClient(options))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeAPICall = async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API call failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    client,
    loading,
    error,
    makeAPICall,
    clearError: () => setError(null),
  }
}

// Export the client and types
export default KaziniHRClient
export type {
  KaziniEmployee,
  PayrollCalculationParams,
  PayrollCalculationResult,
  LeaveRequest,
  AttendanceRecord,
  Department,
  Position,
  KaziniApiResponse,
}

// Example usage in your existing store
/*
// store/employees.ts - Integration example
import KaziniHRClient, { type KaziniEmployee } from '@/lib/kazini-api'

const kaziniClient = new KaziniHRClient({
  apiKey: process.env.NEXT_PUBLIC_KAZINI_API_KEY,
  authToken: getAuthToken(), // Get from your auth system
})

// In your store actions:
fetchEmployees: async (filters = {}) => {
  set({ isLoading: true, error: null })
  try {
    const employees = await kaziniClient.getEmployees({
      page: filters.page || 1,
      limit: filters.limit || 10,
      department: filters.department,
      status: filters.status,
      search: filters.search,
    })
    
    // Transform Kazini format to your local format
    const transformedEmployees = employees.map(emp => ({
      id: emp.id,
      employeeId: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      status: emp.status,
      hireDate: emp.hire_date,
      phone: emp.phone,
      salary: emp.salary,
    }))
    
    set({ employees: transformedEmployees, isLoading: false })
  } catch (error) {
    set({ error: 'Failed to fetch employees', isLoading: false })
  }
}
*/

// Environment configuration
export const KaziniConfig = {
  baseURL: process.env.NEXT_PUBLIC_KAZINI_API_URL || 'https://api.kazinihr.co.ke',
  apiKey: process.env.NEXT_PUBLIC_KAZINI_API_KEY,
  webhookSecret: process.env.KAZINI_WEBHOOK_SECRET,
  
  // Default pagination
  defaultPageSize: 10,
  maxPageSize: 100,
  
  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  
  // Rate limiting
  rateLimitPerMinute: 60,
  rateLimitPerHour: 1000,
}