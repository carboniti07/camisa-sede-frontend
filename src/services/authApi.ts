import { apiRequest } from "./apiClient";

const SESSION_KEY = "admin-session";
const TOKEN_KEY = "admin-token";

export type AdminSession = {
  email: string;
  loggedInAt: string;
  token: string;
};

export async function login(email: string, password: string): Promise<AdminSession> {
  const result = await apiRequest<{ token: string; email: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const session: AdminSession = {
    email: result.email,
    token: result.token,
    loggedInAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(TOKEN_KEY, result.token);
    sessionStorage.setItem("admin-auth", "1");
  }

  return session;
}

export function logout() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem("admin-auth");
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getSession() !== null && Boolean(sessionStorage.getItem(TOKEN_KEY));
}
