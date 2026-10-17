
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api";

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  role: "passenger" | "driver";
}

export interface AuthResponse {
  status: string;
  message: string;
  token?: string;
  user?: AuthUser;
}

interface RegisterData {
  name: string;
  phone: string;
  password: string;
  role: "passenger" | "driver";
}

interface LoginData {
  phone: string;
  password: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

export function registerUser(data: RegisterData) {
  return apiRequest<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginData) {
  return apiRequest<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProfile(token: string) {
  return apiRequest<AuthResponse>("/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
