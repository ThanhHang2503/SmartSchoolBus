/**
 * Helper functions for handling authentication errors
 */

/**
 * Handle authentication errors (401, 403)
 * Clears token and redirects to login page
 */
export const handleAuthError = (logout: () => void) => {
  console.warn("Authentication error: Clearing token and redirecting to login");
  logout();
};

/**
 * Check if response is an authentication error
 */
export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};

/**
 * Parse error response from backend
 * Handles both JSON and text responses
 */
export const parseErrorResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
      return { message: "Unknown error", error: "Failed to parse response" };
    }
  } else {
    try {
      const text = await response.text();
      return { message: text || "Unknown error", raw: text };
    } catch (e) {
      return { message: "Unknown error", error: "Failed to read response" };
    }
  }
};

