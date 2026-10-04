const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://clinic-management-api-hoil.onrender.com/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  let result;

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

export const loginUser = async (payload) => {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const registerUser = async (payload) => {
  return request("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};