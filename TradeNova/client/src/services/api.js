const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const request = async (path, options = {}) => {
  // ✅ ALWAYS fetch latest token
  const token = localStorage.getItem("tradenova_token");

  console.log("TOKEN USED:", token);

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};