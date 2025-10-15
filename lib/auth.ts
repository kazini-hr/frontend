import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import { User } from './auth-context';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/login', {
            username: email,
            password
          });
          
          // Get user info after successful login
          const userResponse = await api.get('/api/auth/me');
          const userData = userResponse.data;
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout');
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/api/auth/me');
          const userData = response.data;
          
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Role checking utilities
export const hasRole = (userRoles: UserRole[], requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    [UserRole.EMPLOYEE]: 1,
    [UserRole.COMPANY_ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3
  };
  
  const userHighestRole = Math.max(...userRoles.map(role => roleHierarchy[role] || 0));
  return userHighestRole >= roleHierarchy[requiredRole];
};

export const isAdmin = (user: User | null): boolean => {
  return user?.user?.roles ? hasRole(user.user.roles as UserRole[], UserRole.COMPANY_ADMIN) : false;
};

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.user?.roles?.includes('SUPER_ADMIN' as UserRole) ?? false;
};
