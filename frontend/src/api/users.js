import { API_BASE } from "./client.js";

/**
 * @param {{ first_name: string; last_name: string; username: string; email: string; password: string }} body
 */
export function registerUser(body) {
  return fetch(`${API_BASE}/users`, {  //fetch
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
