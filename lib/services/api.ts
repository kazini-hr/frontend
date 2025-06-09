const API_BASE_URL = 'http://localhost:5000';

export type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  errors?: {
    nonField?: string[];
    [key: string]: string[] | undefined;
  };
};

export const api = {
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        errors: {
          nonField: ['Network error. Please try again.']
        }
      };
    }
  },
  
  // Add other API methods as needed
};
