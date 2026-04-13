import jwt from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/jwt.js";

/**
 * @param {{ id_users: number; email: string; username: string }} utilisateur
 */
export function creerJetonUtilisateur(utilisateur) {
  const payload = {
    id_users: utilisateur.id_users,
    email: utilisateur.email,
    username: utilisateur.username,
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}
