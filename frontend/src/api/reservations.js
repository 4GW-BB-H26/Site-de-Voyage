import { API_BASE, entetesAvecJeton } from "./client.js";
import { estIdentifiantUtilisateurValide } from "../utils/validator.js";

/**
 * @param {number} userId
 * @param {number} reservationId
 * @param {number} tripId
 * @param {reference_number: int; reservation_date: Date(); date_start: Date(); date_end: Date(); nb_travelers: int; price: float; status: string;} body
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
      "Content-Type": "application/json",
      ...entetesAvecJeton(),
    },
  });
}

//pour ajouter des reservation
export function addReservationForUser(userId, body, tripId) {
  const chargeUtile = {
    reference_number: Number(body.reference_number ?? ""),
    reservation_date: body.reservation_date,
    date_start: body.date_start,
    date_end: body.date_end,
    nb_travelers: Number(body.nb_travelers ?? ""),
    price: Number(body.price ?? ""),
    status: body.status,
    users_id_users: userId,
    trip_id_trip: tripId,
  };
  return fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chargeUtile),
  });
}
