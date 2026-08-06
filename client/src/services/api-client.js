import { env } from "@/env";

const TOKEN_KEY = "my_finance_access_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiRequest(endpoint, options = {}) {
  const baseUrl = env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const storedToken = getStoredToken();
  if (storedToken) {
    headers["Authorization"] = `Bearer ${storedToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      setStoredToken(null);
      return {
        success: false,
        error: data.error || data.message || "Unauthorized",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP error! Status: ${response.status}`,
      };
    }

    // Automatically cache token if returned in login/auth response
    if (data?.token || data?.accessToken) {
      setStoredToken(data.token || data.accessToken);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    return {
      success: false,
      error: message,
    };
  }
}

export function apiGet(endpoint, options) {
  return apiRequest(endpoint, { ...options, method: "GET" });
}

export function apiPost(endpoint, payload, options) {
  return apiRequest(endpoint, {
    ...options,
    method: "POST",
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });
}

export function apiPut(endpoint, payload, options) {
  return apiRequest(endpoint, {
    ...options,
    method: "PUT",
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });
}

export function apiDelete(endpoint, options) {
  return apiRequest(endpoint, { ...options, method: "DELETE" });
}

export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
