import { API_BASE } from "./client.js";

/**
 * @param {string} userId
 */

//recupre les favoris dun user
export function fetchFavorisByUser(userId) {
  return fetch(`${API_BASE}/favorites/user/${userId}`);
}

//ajoute un favoris
export function addFavoris(body) {
  return fetch(`${API_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

//enleve un favoris
export function removeFavoris(id) {
  return fetch(`${API_BASE}/favorites/${id}`, {
    method: "DELETE",
  });
}
