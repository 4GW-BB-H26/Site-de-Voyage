import { API_BASE } from "./client.js";

/**
 * @param {string} userId
 */
export function fetchFavorisByUser(userId) {
  return fetch(`${API_BASE}/favorites/user/${userId}`);
}
// fonction pour ajouter un favoris
export function addFavoris(body) {
  return fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
// fonction pour enlever un favoris
export function removeFavoris(id) {
  return fetch(`${API_BASE}/favorites/${id}`, {
    method: "DELETE",
  });
}
