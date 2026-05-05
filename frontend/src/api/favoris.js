import { API_BASE } from "./client.js";

/**
 * @param {string} userId
 */
export function fetchFavorisByUser(userId) {
  return fetch(`${API_BASE}/favorites/user/${userId}`);
}

export function addFavoris(body) {
  return fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function removeFavoris(id) {
  return fetch(`${API_BASE}/favorites/${id}`, {
    method: "DELETE",
  });
}
