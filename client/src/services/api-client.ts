import { env } from "@/env";
import { ApiResponse } from "@/types";

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL;
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: HeadersInit = {
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
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const refreshRes = await this.post<{ accessToken?: string }>("/auth/refresh", {});
            this.isRefreshing = false;
            if (refreshRes.success) {
              this.onRefreshed(refreshRes.data?.accessToken || "refreshed");
              return this.request<T>(endpoint, options, true);
            }
          } catch {
            this.isRefreshing = false;
          }
        } else {
          return new Promise((resolve) => {
            this.addRefreshSubscriber(() => {
              resolve(this.request<T>(endpoint, options, true));
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Network request failed";
      return {
        success: false,
        error: message,
      };
    }
  }

  public get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, payload: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public put<T>(endpoint: string, payload: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
