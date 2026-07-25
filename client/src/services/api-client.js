import { env } from "@/env";

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

async function apiRequest(endpoint, options = {}, isRetry = false) {
  const baseUrl = env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (
      response.status === 401 &&
      !isRetry &&
      endpoint !== "/auth/refresh" &&
      endpoint !== "/auth/google"
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await apiPost("/auth/refresh", {});
          isRefreshing = false;
          if (refreshRes.success) {
            onRefreshed(refreshRes.data?.accessToken || "refreshed");
            return apiRequest(endpoint, options, true);
          }
        } catch {
          isRefreshing = false;
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
