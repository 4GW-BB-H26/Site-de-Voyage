/**
 * Où on stocke les comptes (inscription / connexion).
 * - oracle : table USERS (comportement “cours”, tout passe par la BD relationnelle)
 * - mongo : collection dédiée — pratique quand Oracle râle encore côté identifiants
 */
export const authMode = (process.env.AUTH_MODE || "oracle").toLowerCase();

/** Raccourci pour le contrôleur users : évite de répéter la comparaison de chaîne */
export const useMongoAuth = authMode === "mongo";
