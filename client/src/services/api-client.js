import { env } from "@/env";

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  if (typeof window !== "undefined" && newToken) {
    localStorage.setItem("my_finance_access_token", newToken);
  }
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("my_finance_access_token");
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("my_finance_access_token", token);
  } else {
    localStorage.removeItem("my_finance_access_token");
  }
}

export function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("my_finance_refresh_token");
}

export function setStoredRefreshToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("my_finance_refresh_token", token);
  } else {
    localStorage.removeItem("my_finance_refresh_token");
  }
}

async function apiRequest(endpoint, options = {}, isRetry = false) {
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

    // If 401 and we have a storedToken, attempt refresh ONCE
    if (
      response.status === 401 &&
      !isRetry &&
      endpoint !== "/auth/refresh" &&
      endpoint !== "/auth/google" &&
      endpoint !== "/auth/me"
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshTokenVal = getStoredRefreshToken();
          const refreshRes = await apiPost("/auth/refresh", { refreshToken: refreshTokenVal });
          isRefreshing = false;
          if (refreshRes.success && refreshRes.data?.accessToken) {
            const newToken = refreshRes.data.accessToken;
            setStoredToken(newToken);
            if (refreshRes.data.refreshToken) {
              setStoredRefreshToken(refreshRes.data.refreshToken);
            }
            onRefreshed(newToken);
            return apiRequest(endpoint, options, true);
          } else {
            setStoredToken(null);
            setStoredRefreshToken(null);
          }
        } catch {
          isRefreshing = false;
          setStoredToken(null);
          setStoredRefreshToken(null);
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(apiRequest(endpoint, options, true));
          });
        });
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP error! Status: ${response.status}`,
      };
    }

    // Automatically cache token if returned in response
    if (data?.accessToken) {
      setStoredToken(data.accessToken);
    }
    if (data?.refreshToken) {
      setStoredRefreshToken(data.refreshToken);
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
    body: JSON.stringify(payload),
  });
}

export function apiPut(endpoint, payload, options) {
  return apiRequest(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(payload),
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
