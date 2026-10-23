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

function resolveImageUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || !API_URL) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function resolveGalleryItems(items: GalleryItem[]): GalleryItem[] {
  return items.map((item) => ({ ...item, image_url: resolveImageUrl(item.image_url) }));
}

export type AdminUser = {
  id: number;
  username: string;
  role: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  is_published: boolean;
  source: string;
  source_id: string | null;
  created_at: string;
  updated_at: string;
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

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const csrfToken = await getCsrfToken();
  await request<{ status: string }>("/api/auth/password", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export async function getGallery(): Promise<GalleryItem[]> {
  return resolveGalleryItems(await request<GalleryItem[]>("/api/gallery"));
}

export async function getAdminGallery(): Promise<GalleryItem[]> {
  return resolveGalleryItems(await request<GalleryItem[]>("/api/admin/gallery"));
}

export async function uploadGalleryImage(file: File): Promise<{ image_path: string; image_url: string }> {
  const csrfToken = await getCsrfToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/admin/gallery/upload`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRF-Token": csrfToken },
    body: formData,
  });

  if (!response.ok) {
    let message = "Не удалось загрузить изображение";
    try {
      const data = (await response.json()) as { detail?: string };
      message = data.detail ?? message;
    } catch {
      // Keep the generic message.
    }
    throw new Error(message);
  }

  const result = (await response.json()) as { image_path: string; image_url: string };
  return { ...result, image_url: resolveImageUrl(result.image_url) };
}

export async function createGalleryItem(payload: {
  title: string;
  description: string;
  image_path: string;
  sort_order: number;
  is_published: boolean;
}): Promise<GalleryItem> {
  const csrfToken = await getCsrfToken();
  return resolveGalleryItems([
    await request<GalleryItem>("/api/admin/gallery", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
      body: JSON.stringify(payload),
    }),
  ])[0];
}

export async function updateGalleryItem(
  id: number,
  payload: { title?: string; description?: string; sort_order?: number; is_published?: boolean },
): Promise<GalleryItem> {
  const csrfToken = await getCsrfToken();
  return resolveGalleryItems([
    await request<GalleryItem>(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "X-CSRF-Token": csrfToken },
      body: JSON.stringify(payload),
    }),
  ])[0];
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const csrfToken = await getCsrfToken();
  await request<{ status: string }>(`/api/admin/gallery/${id}`, {
    method: "DELETE",
    headers: { "X-CSRF-Token": csrfToken },
  });
}
