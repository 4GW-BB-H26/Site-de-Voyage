import { API_BASE } from "./client.js";

/**
 * @param {string} userId
 */
export function fetchFavorisByUser(userId) {
  return fetch(`${API_BASE}/favorites/user/${userId}`);
}

