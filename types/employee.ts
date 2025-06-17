
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'terminated';
  hireDate: string;
  avatar?: string;
  phone?: string;
  salary?: number;
}