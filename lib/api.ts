
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api";

// -------------------- Authentication --------------------

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

// -------------------- Common API Request --------------------

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

// -------------------- Nearby Vehicles --------------------

export interface NearbyVehicle {
  id: number;
  driver_id: number;
  registration_number: string;
  model: string;
  capacity: number;
  latitude: number;
  longitude: number;
  distance_km: number;
}

export interface NearbyVehiclesResponse {
  status: string;
  count: number;
  radius_km: number;
  vehicles: NearbyVehicle[];
}

export function getNearbyVehicles(
  latitude: number,
  longitude: number,
  radius = 5
) {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radius: String(radius),
  });

  return apiRequest<NearbyVehiclesResponse>(
    `/vehicles/nearby?${query.toString()}`,
    { method: "GET" }
  );
}

// -------------------- Ride Types --------------------

export interface CreateRideData {
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
}

export interface Ride {
  id: number;
  passenger_id: number;
  driver_id?: number | null;
  vehicle_id?: number | null;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRideResponse {
  status: string;
  message: string;
  ride: Ride;
}

// -------------------- Create Ride --------------------

export function createRide(
  token: string,
  data: CreateRideData
) {
  return apiRequest<CreateRideResponse>("/rides", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

// -------------------- Ride History --------------------

export interface RideHistoryResponse {
  status: string;
  count: number;
  rides: Ride[];
}

export function getRideHistory(token: string) {
  return apiRequest<RideHistoryResponse>("/rides/history", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------- Cancel Ride --------------------

export interface CancelRideResponse {
  status: string;
  message: string;
  ride: Ride;
}

export function cancelRide(
  token: string,
  rideId: number
) {
  return apiRequest<CancelRideResponse>(`/rides/${rideId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
