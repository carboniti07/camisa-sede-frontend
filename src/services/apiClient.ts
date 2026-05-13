const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3002").replace(/\/$/, "");

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("admin-token");
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAdminToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String((data as { message?: string }).message)
      : "Erro na comunicação com o servidor.";
    throw new Error(message);
  }

  return data as T;
}
