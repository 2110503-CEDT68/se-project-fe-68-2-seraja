import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cedt-be-for-fe-proj.vercel.app/api/v1";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  // 1. Fetch the session
  const session = await getSession();
  
  // 2. Build headers dynamically
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // 3. Inject Bearer Token if it exists (Critical for Steps 4-12)
  if (session?.user?.token) {
    headers["Authorization"] = `Bearer ${session.user.token}`;
  }

  // 4. Execute Fetch
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 5. Handle non-200 responses (Validation Check - Step 4)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Throwing an error here lets your 'useBookings' catch it and show it to the user
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("API Client Error:", error.message);
    throw error; 
  }
}