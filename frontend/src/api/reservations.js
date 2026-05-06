import { API_BASE, entetesAvecJeton } from "./client.js";
import { estIdentifiantUtilisateurValide } from "../utils/validator.js";

/**
 * @param {number} userId
 * @param {number} reservationId
 */

//fetch les reservations
export function fetchReservationsForUser(userId) {
  if (!estIdentifiantUtilisateurValide(userId)) {
    return Promise.reject(new Error("Identifiant utilisateur invalide."));
  }
  return fetch(`${API_BASE}/reservations/user/${userId}`, {
    headers: {
      ...entetesAvecJeton(),
    },
  });
}

//pour update une reservation (l'annuler)
export function updateReservationForUser(reservationId) {
  if (!estIdentifiantUtilisateurValide(reservationId)) {
    return Promise.reject(new Error("Identifiant reservation invalide."));
  }
  return fetch(`${API_BASE}/reservations/${reservationId}/cancel`, {
    method: "PUT",
    headers: {
      ...entetesAvecJeton(),
    },
  });
}
