import { ApiResponse } from "../types";
import { LoggerInstance } from "../common/logging/logger";

const Logger = new LoggerInstance({ serviceName: "ApiService", filePath: "frontend/src/services/api.service.ts" });

/**
 * API Service to handle all communication with the backend.
 */
export class ApiService {
  /**
   * Helper to append authorization headers.
   */
  private getHeaders(isFormData: boolean = false) {
    const token = localStorage.getItem("token");
    const headers: any = {};
    
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Centralized request handler to handle response parsing and errors.
   */
  private async request<T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const isFormData = options.body instanceof FormData;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...options.headers,
        },
      });

      // Handle empty response bodies (e.g. 204 No Content)
      const text = await response.text();
      let data: any = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text };
        }
      }

      if (!response.ok) {
        Logger.error(`API Error: ${options.method || "GET"} ${url} returned ${response.status}`, data);
        return {
          success: false,
          message: data.message || "An unexpected error occurred",
          error: data.error || null,
        };
      }

      return data;
    } catch (error: any) {
      Logger.error(`Network Error: ${options.method || "GET"} ${url}`, error);
      return {
        success: false,
        message: error.message || "Network error",
        error: error,
      };
    }
  }

  // --- Auth Methods ---

  async signup(data: any) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async socialLogin(idToken: string) {
    return this.request("/api/auth/social/firebase", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", { method: "POST" });
  }

  // --- Athletes Methods ---

  async getAthletes() {
    return this.request("/api/athletes");
  }

  async addAthlete(data: any) {
    return this.request("/api/athletes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAthlete(id: number, data: any) {
    return this.request(`/api/athletes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAthlete(id: number) {
    return this.request(`/api/athletes/${id}`, {
      method: "DELETE",
    });
  }

  // --- Events Methods ---

  async getEvents(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/events?${queryString}`);
  }

  async addEvent(data: any) {
    return this.request("/api/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: number, data: any) {
    return this.request(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: number) {
    return this.request(`/api/events/${id}`, {
      method: "DELETE",
    });
  }

  // --- Registrations Methods ---

  async getRegistrations(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/registrations?${queryString}`);
  }

  async addRegistration(data: any) {
    return this.request("/api/registrations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteRegistration(id: number) {
    return this.request(`/api/registrations/${id}`, {
      method: "DELETE",
    });
  }

  // --- Houses Methods ---

  async getHouses() {
    return this.request("/api/houses");
  }

  async addHouse(data: any) {
    return this.request("/api/houses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateHouse(id: string, data: any) {
    return this.request(`/api/houses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteHouse(id: string) {
    return this.request(`/api/houses/${id}`, {
      method: "DELETE",
    });
  }

  // --- Students Methods ---

  async getStudents() {
    return this.request("/api/students");
  }

  async importStudents(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.request("/api/students/import", {
      method: "POST",
      body: formData,
    });
  }

  async downloadStudentTemplate() {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/students/template", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to download template");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const apiService = new ApiService();

