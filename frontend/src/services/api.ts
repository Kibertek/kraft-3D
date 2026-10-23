const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Ошибка запроса";
    try {
      const data = (await response.json()) as { detail?: string };
      message = data.detail ?? message;
    } catch {
      // Keep the generic message when the API does not return JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export type AdminUser = {
  id: number;
  username: string;
  role: string;
};

export function getCurrentAdmin(): Promise<AdminUser> {
  return request<AdminUser>("/api/auth/me");
}

export function login(username: string, password: string): Promise<AdminUser> {
  return request<AdminUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getCsrfToken(): Promise<string> {
  const data = await request<{ csrf_token: string }>("/api/auth/csrf");
  return data.csrf_token;
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken();
  await request<{ status: string }>("/api/auth/logout", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
  });
}
