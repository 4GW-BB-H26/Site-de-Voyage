import { API_BASE, entetesAvecJeton } from "./client.js";
import { estIdentifiantUtilisateurValide } from "../utils/validator.js";

/**
 * @param {number} userId
 */
export function fetchReservationsForUser(userId) {
  if (!estIdentifiantUtilisateurValide(userId)) {
    return Promise.reject(new Error("Identifiant utilisateur invalide."));
  }
  return fetch(`${API_BASE}/reservations/user/${userId}`, {
    headers: {
      ...entetesAvecJeton(),
    },
  });

//   export function updateReservationForUser(userId, reservationId)
//   {
//     const nouveauStatut = "Annulée"
//     if(!estIdentifiantUtilisateurValide(userId)) {
//     return Promise.reject(new Error("Identifiant utilisateur invalide."));
//   }
//   return fetch(`${API_BASE}/reservations/user/${userId, reservationId}`, {
//     method: "PUT",
//     body: JSON.stringify()
//   }
//   }
}