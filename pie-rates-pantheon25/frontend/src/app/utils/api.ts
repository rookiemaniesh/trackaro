import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Custom hook for making authenticated API requests
export const useApi = () => {
  const { accessToken, logout } = useAuth();

  const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const url = `${API_URL}${endpoint}`;
    
    // Add authorization header
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        // Only set JSON content-type if a body exists and caller didn't override
        ...(!("Content-Type" in (options.headers || {})) && options.body
          ? { "Content-Type": "application/json" }
          : {}),
      },
    };

    try {
      const response = await fetch(url, authOptions);
      
      // Handle authentication errors
      if (response.status === 401) {
        // Automatically logout if unauthorized
        logout();
        throw new Error("Session expired. Please login again.");
      }

      // Gracefully parse response body (json | text | empty)
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      // Some successful responses can be 204 No Content
      if (response.status === 204 || response.status === 205) {
        return undefined as unknown as any;
      }

  let parsed: unknown = undefined;
      try {
        if (isJson) {
          parsed = await response.json();
        } else {
          const text = await response.text();
          // If HTML or empty, keep as text
          parsed = text;
        }
      } catch (e) {
        // Swallow body parse errors; keep parsed undefined
        parsed = undefined;
      }

      // Handle error responses with best-effort message
      if (!response.ok) {
        // Prefer API-provided error message
        let msgFromJson: string | undefined;
        if (parsed && typeof parsed === "object") {
          const rec = parsed as Record<string, unknown>;
          msgFromJson = typeof rec.error === "string" ? rec.error : typeof rec.message === "string" ? rec.message : undefined;
        }
        const msgFromText = typeof parsed === "string" ? parsed.slice(0, 200) : undefined;
        const msg = msgFromJson || msgFromText || `Request failed (${response.status})`;
        throw new Error(msg);
      }

      return parsed as T;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  // Common request methods
  const get = <T = any>(endpoint: string) => apiRequest<T>(endpoint);
  
  const post = <T = any, TBody extends unknown = any>(endpoint: string, data: TBody) => 
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  
  const put = <T = any, TBody extends unknown = any>(endpoint: string, data: TBody) => 
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  
  const del = <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, {
      method: "DELETE",
    });

  return {
    get,
    post,
    put,
    delete: del,
  };
};
