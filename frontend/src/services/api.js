const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiUrl = (path) => `${API_URL}${path}`;

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
