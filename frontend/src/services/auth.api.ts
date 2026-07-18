import api from "../lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  requiresOtp?: boolean;
  userId?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/register",
    payload
  );

  return data;
}

export async function login(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return data;
}

export async function verifyOtp(
  userId: string,
  code: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/verify-otp",
    { userId, code }
  );

  return data;
}

export async function oauthLogin(
  provider: string,
  code: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    `/auth/${provider}`,
    { code }
  );

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}