import { create } from 'zustand'
import type { Employee } from '@/types/employee'

interface EmployeeStore {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  selectedEmployee: Employee | null
  
  // Actions
  fetchEmployees: () => Promise<void>
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  setSelectedEmployee: (employee: Employee | null) => void
  searchEmployees: (query: string) => Employee[]
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,
  selectedEmployee: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null })
    try {
      // Mock data - replace with actual API call
      const mockEmployees: Employee[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          name: 'John Doe',
          email: 'john.doe@company.com',
          department: 'Engineering',
          position: 'Senior Developer',
          status: 'active',
          hireDate: '2023-01-15',
          phone: '+254712345678',
          salary: 120000,
        },
        {
          id: '2',
          employeeId: 'EMP002',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@company.com',
          department: 'Marketing',
          position: 'Marketing Manager',
          status: 'active',
          hireDate: '2022-08-20',
          phone: '+254723456789',
          salary: 95000,
        },
        {
          id: '3',
          employeeId: 'EMP003',
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          department: 'Sales',
          position: 'Sales Representative',
          status: 'active',
          hireDate: '2024-02-01',
          phone: '+254734567890',
          salary: 75000,
        },
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ employees: mockEmployees, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch employees', isLoading: false })
    }
  },

  addEmployee: async (employeeData) => {
    set({ isLoading: true, error: null })
    try {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
        employeeId: `EMP${Date.now().toString().slice(-3)}`,
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to add employee', isLoading: false })
    }
  },

  updateEmployee: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        employees: state.employees.map(emp =>
          emp.id === id ? { ...emp, ...updates } : emp
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to update employee', isLoading: false })
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set(state => ({
        employees: state.employees.filter(emp => emp.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to delete employee', isLoading: false })
    }
  },

  setSelectedEmployee: (employee) => {
    set({ selectedEmployee: employee })
  },

  searchEmployees: (query) => {
    const { employees } = get()
    if (!query) return employees
    
    const lowercaseQuery = query.toLowerCase()
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(lowercaseQuery) ||
      emp.email.toLowerCase().includes(lowercaseQuery) ||
      emp.department.toLowerCase().includes(lowercaseQuery) ||
      emp.position.toLowerCase().includes(lowercaseQuery) ||
      emp.employeeId.toLowerCase().includes(lowercaseQuery)
    )
  },
}))

export const useEmployeeStoreEnhanced = create<EmployeeStore>((set, get) => ({
  ...useEmployeeStore.getState(),
  
  // Additional helper methods
  getEmployeesByDepartment: (department: string) => {
    return get().employees.filter(emp => emp.department === department)
  },
  
  getEmployeesByStatus: (status: Employee['status']) => {
    return get().employees.filter(emp => emp.status === status)
  },
  
  getEmployeeStats: () => {
    const employees = get().employees
    const totalEmployees = employees.length
    const activeEmployees = employees.filter(emp => emp.status === 'active').length
    const departments = new Set(employees.map(emp => emp.department)).size
    const averageSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length
    
    return {
      totalEmployees,
      activeEmployees,
      departments,
      averageSalary,
      activeRate: Math.round((activeEmployees / totalEmployees) * 100) || 0,
    }
  },
  
  // Bulk operations
  bulkUpdateEmployees: async (employeeIds: string[], updates: Partial<Employee>) => {
    set({ isLoading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        employees: state.employees.map(emp =>
          employeeIds.includes(emp.id) ? { ...emp, ...updates } : emp
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to update employees', isLoading: false })
    }
  },
  
  exportEmployees: (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    const employees = get().employees
    // Implementation would depend on the format
    console.log(`Exporting ${employees.length} employees to ${format}`)
    return employees
  },
}))
