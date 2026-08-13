// A single, reusable function for talking to the backend.
// Instead of writing fetch() + headers + error handling in every
// component, every API call goes through this one function.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiClientOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string; // JWT token, passed in explicitly (see note below)
}

// The shape every backend response follows (matches your Express backend's sendResponse)
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If a token is provided, attach it automatically — no need to
  // remember this in every single component that calls the API.
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result: ApiResponse<T> = await response.json();

  // Your backend always sends { success: false, message: "..." } on errors.
  // We convert that into a thrown JS Error, so calling code can just
  // use try/catch instead of checking `.success` every single time.
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}