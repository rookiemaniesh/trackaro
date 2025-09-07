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
        // Only set JSON content-type if a body exists, caller didn't override, and it's not FormData
        ...(!("Content-Type" in (options.headers || {})) && options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
      },
    };

    try {
      console.log('API Request:', {
        url,
        method: authOptions.method,
        headers: authOptions.headers,
        bodyType: authOptions.body?.constructor?.name,
        bodySize: authOptions.body instanceof FormData ? 'FormData' : 
                 authOptions.body instanceof Blob ? authOptions.body.size :
                 typeof authOptions.body === 'string' ? authOptions.body.length : 'unknown'
      });
      
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

  const postFormData = async <T = any>(endpoint: string, formData: FormData) => {
    console.log('postFormData called with:', {
      endpoint,
      formDataEntries: Array.from(formData.entries()),
      formDataKeys: Array.from(formData.keys())
    });
    
    // For FormData, we need to handle headers differently to avoid conflicts
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const url = `${API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Do NOT set Content-Type - let browser set it with boundary
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please login again.");
    }

    // Parse response
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (response.status === 204 || response.status === 205) {
      return undefined as unknown as any;
    }

    let parsed: unknown = undefined;
    try {
      if (isJson) {
        parsed = await response.json();
      } else {
        const text = await response.text();
        parsed = text;
      }
    } catch (e) {
      parsed = undefined;
    }

    // Handle error responses
    if (!response.ok) {
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
  };
  
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
    postFormData,
    put,
    delete: del,
  };
};
