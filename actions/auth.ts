'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';

export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Authentticates a user with the given credentials.
 * @param {LoginCredentials} credentials - The user's login credentials.
 * @returns {Promise<{status: string, data?: any, errors?: any}>} - A promise that resolves to the login response.
 * @throws {Error} - Throws an error if the login fails.
*/
export const login = async (credentials: LoginCredentials): Promise<{status: string, data?: any, errors?: any}> => {
  try {
    const { email, password } = credentials;
    const authStore = useAuthStore.getState();
    const success = await authStore.login(email, password);
    
    if (success) {
      return { 
        status: 'success',
        data: useAuthStore.getState().user
      };
    } else {
      const error = useAuthStore.getState().error;
      toast.error(error || 'Login failed');
      return { 
        status: 'error',
        errors: {
          nonField: [error || 'Login failed']
        }
      };
    }
  } catch (error) {
    toast.error('An unexpected error occurred');
    return { 
      status: 'error',
      errors: {
        nonField: ['An unexpected error occurred']
      }
    };
  }
};