import { PayrollCalculation } from "@/types/payroll"

const API_BASE_URL = 'https://api.kazinihr.co.ke'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token from cookies if available
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]
      
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Payroll calculator
  async calculatePayroll(params: {
    basic_salary: number
    income_period: 'monthly' | 'annual'
    currency: string
    allowances: number
    include_nhif: boolean
    include_nssf: boolean
    include_housing_levy: boolean
    is_pensionable: boolean
    has_disability_exemption: boolean
  }): Promise<PayrollCalculation> {
    const queryParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    )
    
    return this.get<PayrollCalculation>(
      `/api/payroll/calculate/public?${queryParams}`
    )
  }
}

export const apiClient = new ApiClient(API_BASE_URL)