
import validator from "validator";
import { API_BASE } from "./client.js";

/**
 * @param {{ first_name: string; last_name: string; username: string; email: string; password: string }} body
 */

//creer un compte (user)
export function registerUser(body) {
  const chargeUtile = {
    first_name: validator.trim(String(body.first_name ?? "")),
    last_name: validator.trim(String(body.last_name ?? "")),
    username: validator.trim(String(body.username ?? "")),
    email: validator.trim(String(body.email ?? "")),
    password: body.password,
  };
  return fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chargeUtile),
  });
}
