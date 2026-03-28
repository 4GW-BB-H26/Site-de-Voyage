import { API_BASE } from "./client.js";

/**
 * @param {number} userId
 */
export function fetchReservationsForUser(userId) {
  return fetch(`${API_BASE}/reservations/user/${userId}`);
}
