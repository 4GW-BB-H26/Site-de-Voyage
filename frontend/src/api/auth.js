import validator from "validator";
import { API_BASE } from "./client.js";

/**
 * Connexion : mot de passe dans le corps (POST), pas dans l’URL.
 * @param {{ email: string; password: string }} identifiants
 * @returns {Promise<Response>}
 */

//requête POST securisé vers API securisé pour login en JSON
export function loginUser(identifiants) {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: validator.trim(String(identifiants.email ?? "")),
      password: identifiants.password,
    }),
  });
}
