/**
 * Utility functions for managing authentication cookies
 */

// Client-side cookie clearing function
export function clearAuthCookiesClient() {
  // Set cookies with past expiration date
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "kazinihr_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// For use in API routes or server components if needed
export function clearAuthCookiesResponse(response: Response) {
  response.headers.append('Set-Cookie', 'auth_token=; Max-Age=0; path=/; HttpOnly');
  response.headers.append('Set-Cookie', 'kazinihr_auth=; Max-Age=0; path=/; HttpOnly');
  return response;
}