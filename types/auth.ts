export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'employee';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}