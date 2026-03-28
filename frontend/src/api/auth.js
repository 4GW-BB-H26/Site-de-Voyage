import { API_BASE } from "./client.js";

/**
 * @param {{ email: string; password: string }} credentials
 * @returns {Promise<Response>}
 */
export function loginUser(credentials) {
  const qs = new URLSearchParams({
    email: credentials.email.trim(),
    password: credentials.password,
  });
  return fetch(`${API_BASE}/user?${qs.toString()}`);
}
