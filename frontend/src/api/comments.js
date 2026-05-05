import { API_BASE } from "./client.js";

//Récupere les commentaires
export async function fetchSupportComments() {
  const res = await fetch(`${API_BASE}/comments/destination/support`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur de chargement");
  return data.data; 
}

// Ajouter le commentaire
export async function addSupportComment(userName, comment) {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      destinationId: "support", 
      auteur: userName,
      texte: comment
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur d'ajout");
  return data.data;
}