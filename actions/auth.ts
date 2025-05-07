'use server';
import { cookies } from "next/headers";

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    status: string;
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        }
    };
}

/**
 * Authentticates a user with the given credentials.
 * @param {LoginCredentials} credentials - The user's login credentials.
 * @returns {Promise<LoginResponse>} - A promise that resolves to the login response.
 * @throws {Error} - Throws an error if the login fails.
*/
export async function login(credentials: LoginCredentials): Promise<LoginResponse>{
    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            cache: 'no-store',
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Login failed');
            } catch (e) {
                throw new Error(`Login failed: ${response.status} ${response.statusText}`);
            }
        }

        const data: LoginResponse = await response.json();

        // Store the auth token in cookies
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'authToken',
            value: data.data.token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error instanceof Error ? error : new Error('Authentication Failed');
    }
}