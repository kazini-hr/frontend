// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Enhanced mock employee data with more realistic information
let employees = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@kazinihr.co.ke',
    department: 'Engineering',
    position: 'Senior Full Stack Developer',
    status: 'active',
    hireDate: '2023-01-15',
    phone: '+254712345678',
    salary: 180000,
    avatar: null,
    address: '123 Kiambu Road, Nairobi',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+254798765432',
    dateOfBirth: '1990-05-15',
    nationalId: '12345678',
    bankAccount: '1234567890',
    bankName: 'Equity Bank',
    taxPin: 'A001234567P',
    nhifNumber: 'NH123456',
    nssfNumber: 'NS789012',
    contractType: 'permanent',
    workLocation: 'hybrid',
    reportingManager: 'Sarah Wilson',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    education: 'BSc Computer Science - University of Nairobi',
    experience: '5 years',
    notes: 'Excellent performance, promoted twice in 2 years',
    leaveBalance: {
      annual: 18,
      sick: 7,
      personal: 3
    },
    performance: {
      lastReview: '2024-01-15',
      rating: 4.5,
      goals: 8,
      completed: 7
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@kazinihr.co.ke',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'active',
    hireDate: '2022-08-20',
    phone: '+254723456789',
    salary: 150000,
    avatar: null,
    address: '456 Westlands Avenue, Nairobi',
    emergencyContact: 'Michael Wilson',
    emergencyPhone: '+254787654321',
    dateOfBirth: '1988-12-10',
    nationalId: '23456789',
    bankAccount: '2345678901',
    bankName: 'KCB Bank',
    taxPin: 'A002345678Q',
    nhifNumber: 'NH234567',
    nssfNumber: 'NS890123',
    contractType: 'permanent',
    workLocation: 'office',
    reportingManager: 'David Kim',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Brand Management'],
    education: 'MBA Marketing - Strathmore University',
    experience: '7 years',
    notes: 'Team leader, excellent communication skills',
    leaveBalance: {
      annual: 22,
      sick: 10,
      personal: 5
    },
    performance: {
      lastReview: '2024-02-01',
      rating: 4.7,
      goals: 10,
      completed: 9
    },
    createdAt: '2022-08-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mike Johnson',
    email: 'mike.johnson@kazinihr.co.ke',
    department: 'Sales',
    position: 'Senior Sales Representative',
    status: 'active',
    hireDate: '2024-02-01',
    phone: '+254734567890',
    salary: 120000,
    avatar: null,
    address: '789 Karen Road, Nairobi',
    emergencyContact: 'Lisa Johnson',
    emergencyPhone: '+254776543210',
    dateOfBirth: '1992-03-22',
    nationalId: '34567890',
    bankAccount: '3456789012',
    bankName: 'Cooperative Bank',
    taxPin: 'A003456789R',
    nhifNumber: 'NH345678',
    nssfNumber: 'NS901234',
    contractType: 'permanent',
    workLocation: 'field',
    reportingManager: 'James Ochieng',
    skills: ['B2B Sales', 'CRM', 'Negotiation', 'Client Relations', 'Market Analysis'],
    education: 'Bachelor of Commerce - USIU',
    experience: '4 years',
    notes: 'Consistently exceeds targets, good team player',
    leaveBalance: {
      annual: 25,
      sick: 10,
      personal: 5
    },
    performance: {
      lastReview: '2024-03-01',
      rating: 4.2,
      goals: 6,
      completed: 5
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@kazinihr.co.ke',
    department: 'Human Resources',
    position: 'HR Business Partner',
    status: 'active',
    hireDate: '2021-11-10',
    phone: '+254745678901',
    salary: 140000,
    avatar: null,
    address: '321 Kilimani Road, Nairobi',
    emergencyContact: 'Peter Wanjiku',
    emergencyPhone: '+254765432109',
    dateOfBirth: '1989-07-18',
    nationalId: '45678901',
    bankAccount: '4567890123',
    bankName: 'Standard Chartered',
    taxPin: 'A004567890S',
    nhifNumber: 'NH456789',
    nssfNumber: 'NS012345',
    contractType: 'permanent',
    workLocation: 'hybrid',
    reportingManager: 'Daniel Mwangi',
    skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'Training', 'HRIS'],
    education: 'Masters in Human Resource Management - UoN',
    experience: '6 years',
    notes: 'Expert in employment law, handles complex cases well',
    leaveBalance: {
      annual: 15,
      sick: 8,
      personal: 2
    },
    performance: {
      lastReview: '2024-01-20',
      rating: 4.6,
      goals: 9,
      completed: 8
    },
    createdAt: '2021-11-10T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@kazinihr.co.ke',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'active',
    hireDate: '2023-06-15',
    phone: '+254756789012',
    salary: 110000,
    avatar: null,
    address: '654 Eastleigh Section 1, Nairobi',
    emergencyContact: 'Fatima Hassan',
    emergencyPhone: '+254754321098',
    dateOfBirth: '1993-11-08',
    nationalId: '56789012',
    bankAccount: '5678901234',
    bankName: 'NCBA Bank',
    taxPin: 'A005678901T',
    nhifNumber: 'NH567890',
    nssfNumber: 'NS123456',
    contractType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Mary Kamau',
    skills: ['Financial Analysis', 'Excel', 'PowerBI', 'Budgeting', 'Forecasting'],
    education: 'CPA Part III, Bachelor of Commerce - Kenyatta University',
    experience: '3 years',
    notes: 'Quick learner, good attention to detail',
    leaveBalance: {
      annual: 20,
      sick: 9,
      personal: 4
    },
    performance: {
      lastReview: '2024-02-15',
      rating: 4.3,
      goals: 7,
      completed: 6
    },
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    name: 'Linda Omondi',
    email: 'linda.omondi@kazinihr.co.ke',
    department: 'Operations',
    position: 'Operations Coordinator',
    status: 'inactive',
    hireDate: '2022-03-01',
    phone: '+254767890123',
    salary: 95000,
    avatar: null,
    address: '987 Embakasi Estate, Nairobi',
    emergencyContact: 'John Omondi',
    emergencyPhone: '+254743210987',
    dateOfBirth: '1991-09-14',
    nationalId: '67890123',
    bankAccount: '6789012345',
    bankName: 'Absa Bank',
    taxPin: 'A006789012U',
    nhifNumber: 'NH678901',
    nssfNumber: 'NS234567',
    contractType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Peter Mutua',
    skills: ['Project Management', 'Process Improvement', 'Team Coordination', 'Data Analysis'],
    education: 'Bachelor of Business Administration - Moi University',
    experience: '4 years',
    notes: 'Currently on maternity leave, expected return April 2024',
    leaveBalance: {
      annual: 25,
      sick: 10,
      personal: 5
    },
    performance: {
      lastReview: '2023-12-15',
      rating: 4.1,
      goals: 8,
      completed: 7
    },
    createdAt: '2022-03-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    name: 'Robert Kimani',
    email: 'robert.kimani@kazinihr.co.ke',
    department: 'Engineering',
    position: 'DevOps Engineer',
    status: 'active',
    hireDate: '2023-09-01',
    phone: '+254778901234',
    salary: 160000,
    avatar: null,
    address: '135 Thika Road, Kasarani',
    emergencyContact: 'Margaret Kimani',
    emergencyPhone: '+254732109876',
    dateOfBirth: '1987-04-20',
    nationalId: '78901234',
    bankAccount: '7890123456',
    bankName: 'I&M Bank',
    taxPin: 'A007890123V',
    nhifNumber: 'NH789012',
    nssfNumber: 'NS345678',
    contractType: 'permanent',
    workLocation: 'remote',
    reportingManager: 'John Doe',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    education: 'BSc Computer Engineering - JKUAT',
    experience: '8 years',
    notes: 'Infrastructure expert, handles critical deployments',
    leaveBalance: {
      annual: 16,
      sick: 10,
      personal: 3
    },
    performance: {
      lastReview: '2024-03-01',
      rating: 4.8,
      goals: 5,
      completed: 5
    },
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '8',
    employeeId: 'EMP008',
    name: 'Susan Muthoni',
    email: 'susan.muthoni@kazinihr.co.ke',
    department: 'Customer Support',
    position: 'Senior Support Agent',
    status: 'terminated',
    hireDate: '2021-05-10',
    phone: '+254789012345',
    salary: 80000,
    avatar: null,
    address: '246 Githurai 44, Nairobi',
    emergencyContact: 'Joseph Muthoni',
    emergencyPhone: '+254721098765',
    dateOfBirth: '1994-01-25',
    nationalId: '89012345',
    bankAccount: '8901234567',
    bankName: 'Family Bank',
    taxPin: 'A008901234W',
    nhifNumber: 'NH890123',
    nssfNumber: 'NS456789',
    contractType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Catherine Njeri',
    skills: ['Customer Service', 'Technical Support', 'CRM Systems', 'Problem Solving'],
    education: 'Diploma in IT - Kenya Institute of Management',
    experience: '5 years',
    notes: 'Contract terminated due to performance issues - February 2024',
    leaveBalance: {
      annual: 0,
      sick: 0,
      personal: 0
    },
    performance: {
      lastReview: '2023-11-15',
      rating: 2.8,
      goals: 10,
      completed: 4
    },
    createdAt: '2021-05-10T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z'
  }
]

// Helper function to check authentication
async function checkAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')
    
    if (!token) {
        return { isAuthenticated: false, user: null }
    }
    // In production, properly validate JWT token
    const userData = JSON.parse(atob(token.value))
    return { 
      isAuthenticated: true, 
      user: { id: userData.userId, email: userData.email } 
    }
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

// Helper function to generate employee ID
function generateEmployeeId(): string {
  const nextId = employees.length + 1
  return `EMP${String(nextId).padStart(3, '0')}`
}

// Helper function to filter employees based on query parameters
function filterEmployees(employees: any[], searchParams: URLSearchParams) {
  let filteredEmployees = [...employees]

  // Search functionality
  const search = searchParams.get('search')
  if (search) {
    const searchLower = search.toLowerCase()
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.name.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower) ||
      emp.employeeId.toLowerCase().includes(searchLower)
    )
  }

  // Department filter
  const department = searchParams.get('department')
  if (department && department !== 'all') {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.department.toLowerCase() === department.toLowerCase()
    )
  }

  // Status filter
  const status = searchParams.get('status')
  if (status && status !== 'all') {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.status === status
    )
  }

  // Contract type filter
  const contractType = searchParams.get('contract_type')
  if (contractType && contractType !== 'all') {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.contractType === contractType
    )
  }

  // Work location filter
  const workLocation = searchParams.get('work_location')
  if (workLocation && workLocation !== 'all') {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.workLocation === workLocation
    )
  }

  // Salary range filter
  const minSalary = searchParams.get('min_salary')
  const maxSalary = searchParams.get('max_salary')
  if (minSalary) {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.salary >= parseInt(minSalary)
    )
  }
  if (maxSalary) {
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.salary <= parseInt(maxSalary)
    )
  }

  // Date range filter (hire date)
  const startDate = searchParams.get('hire_start_date')
  const endDate = searchParams.get('hire_end_date')
  if (startDate) {
    filteredEmployees = filteredEmployees.filter(emp =>
      new Date(emp.hireDate) >= new Date(startDate)
    )
  }
  if (endDate) {
    filteredEmployees = filteredEmployees.filter(emp =>
      new Date(emp.hireDate) <= new Date(endDate)
    )
  }

  return filteredEmployees
}

// Helper function for pagination
function paginateResults(employees: any[], searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  const paginatedEmployees = employees.slice(offset, offset + limit)
  
  return {
    employees: paginatedEmployees,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(employees.length / limit),
      totalCount: employees.length,
      hasNext: offset + limit < employees.length,
      hasPrev: page > 1
    }
  }
}

// GET /api/employees - Fetch employees with filtering, searching, and pagination
export async function GET(request: NextRequest) {
  try {
    const { isAuthenticated } = await checkAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Apply filters
    let filteredEmployees = filterEmployees(employees, searchParams)

    // Sorting
    const sortBy = searchParams.get('sort_by') || 'name'
    const sortOrder = searchParams.get('sort_order') || 'asc'
    
    filteredEmployees.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })

    // Handle pagination
    const includePagination = searchParams.get('paginate') !== 'false'
    if (includePagination) {
      const result = paginateResults(filteredEmployees, searchParams)
      return NextResponse.json(result)
    }

    // Return all results without pagination
    return NextResponse.json({
      employees: filteredEmployees,
      totalCount: filteredEmployees.length
    })

  } catch (error) {
    console.error('GET /api/employees error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated, user } = await checkAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const employeeData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'department', 'position', 'hireDate']
    const missingFields = requiredFields.filter(field => !employeeData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmployee = employees.find(emp => emp.email === employeeData.email)
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 409 }
      )
    }

    // Generate new employee
    const newEmployee = {
      id: Date.now().toString(),
      employeeId: generateEmployeeId(),
      status: 'active',
      avatar: null,
      contractType: 'permanent',
      workLocation: 'office',
      leaveBalance: {
        annual: 25,
        sick: 10,
        personal: 5
      },
      performance: {
        lastReview: null,
        rating: null,
        goals: 0,
        completed: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...employeeData
    }

    employees.push(newEmployee)

    // Log audit trail (in production, save to database)
    console.log(`Employee created: ${newEmployee.employeeId} by user ${user?.email}`)

    return NextResponse.json(newEmployee, { status: 201 })

  } catch (error) {
    console.error('POST /api/employees error:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}

// PUT /api/employees - Bulk update employees
export async function PUT(request: NextRequest) {
  try {
    const { isAuthenticated, user } = await checkAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { employeeIds, updates } = await request.json()
    
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return NextResponse.json(
        { error: 'Employee IDs array is required' },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      )
    }

    // Find employees to update
    const employeesToUpdate = employees.filter(emp => employeeIds.includes(emp.id))
    
    if (employeesToUpdate.length === 0) {
      return NextResponse.json(
        { error: 'No employees found with provided IDs' },
        { status: 404 }
      )
    }

    // Validate updates - prevent updating critical fields
    const protectedFields = ['id', 'employeeId', 'createdAt']
    const invalidFields = Object.keys(updates).filter(field => protectedFields.includes(field))
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Cannot update protected fields: ${invalidFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Perform bulk update
    const updatedEmployees: any[] = []
    const currentTime = new Date().toISOString()
    
    employees.forEach(emp => {
      if (employeeIds.includes(emp.id)) {
        const updatedEmployee = {
          ...emp,
          ...updates,
          updatedAt: currentTime
        }
        updatedEmployees.push(updatedEmployee)
        
        // Update in the employees array
        const index = employees.findIndex(e => e.id === emp.id)
        employees[index] = updatedEmployee
      }
    })

    // Log audit trail
    console.log(`Bulk update performed on ${updatedEmployees.length} employees by user ${user?.email}`, {
      employeeIds,
      updates,
      timestamp: currentTime
    })

    return NextResponse.json({
      message: `Successfully updated ${updatedEmployees.length} employees`,
      updatedEmployees,
      count: updatedEmployees.length
    })

  } catch (error) {
    console.error('PUT /api/employees error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk update' },
      { status: 500 }
    )
  }
}

// DELETE /api/employees - Bulk delete employees
export async function DELETE(request: NextRequest) {
  try {
    const { isAuthenticated, user } = await checkAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { employeeIds } = await request.json()
    
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return NextResponse.json(
        { error: 'Employee IDs array is required' },
        { status: 400 }
      )
    }

    // Find employees to delete
    const employeesToDelete = employees.filter(emp => employeeIds.includes(emp.id))
    
    if (employeesToDelete.length === 0) {
      return NextResponse.json(
        { error: 'No employees found with provided IDs' },
        { status: 404 }
      )
    }

    // Instead of hard delete, we'll mark as terminated (soft delete)
    const deletedEmployees: { id: string; employeeId: string; name: string; email: string; department: string; position: string; status: string; hireDate: string; phone: string; salary: number; avatar: null; address: string; emergencyContact: string; emergencyPhone: string; dateOfBirth: string; nationalId: string; bankAccount: string; bankName: string; taxPin: string; nhifNumber: string; nssfNumber: string; contractType: string; workLocation: string; reportingManager: string; skills: string[]; education: string; experience: string; notes: string; leaveBalance: { annual: number; sick: number; personal: number }; performance: { lastReview: string; rating: number; goals: number; completed: number }; createdAt: string; updatedAt: string }[] = []
    const currentTime = new Date().toISOString()
    
    employees.forEach(emp => {
      if (employeeIds.includes(emp.id)) {
        emp.status = 'terminated'
        emp.updatedAt = currentTime
        deletedEmployees.push(emp)
      }
    })

    // Log audit trail
    console.log(`Bulk soft delete performed on ${deletedEmployees.length} employees by user ${user?.email}`, {
      employeeIds,
      timestamp: currentTime
    })

    return NextResponse.json({
      message: `Successfully deleted ${deletedEmployees.length} employees`,
      deletedEmployees,
      count: deletedEmployees.length
    })

  } catch (error) {
    console.error('DELETE /api/employees error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk delete' },
      { status: 500 }
    )
  }
}