import { ApiError } from "./ApiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP Error: ${response.status}`,
      errorData,
    );
  }

  return response.json() as Promise<T>;
}
