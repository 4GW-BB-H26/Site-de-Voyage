/**
 * Validations métier réutilisables (paquet npm validator).
 *
 * Ce fichier regroupe les prédicats pour les règles personnalisées d'express-validator
 * et les constantes partagées comme les motifs pour les en-têtes HTTP.
 * Les chaînes body, param et header restent dans le fichier validators index.
 */
import validator from "validator";

/**
 * Motif pour l'en-tête Authorization attendu par l'API JWT.
 * On attend le mot Bearer, au moins un espace, puis au moins un caractère pour le jeton.
 * La casse de Bearer est tolérée grâce au drapeau i en fin de regex.
 */
export const REGEX_AUTHORIZATION_BEARER = /^Bearer\s+.+$/i;

/**
 * Dit si la valeur peut être interprétée comme une date côté serveur.
 * On teste d'abord une chaîne ISO 8601, puis isDate pour des formats du type année mois jour,
 * puis le parse du constructeur Date pour les autres formes acceptées par JavaScript.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function estDateAccepteePourApi(value) {
  if (value == null) return false;
  const s = String(value).trim();
  if (s === "") return false;
  if (validator.isISO8601(s, { strict: false })) return true;
  if (validator.isDate(s)) return true;
  const t = Date.parse(s);
  return !Number.isNaN(t);
}

/**
 * Contrôle les champs date d'une réservation avant insertion Oracle.
 * On commence par estDateAccepteePourApi pour écarter le vide et le non sens.
 * Ensuite on accepte soit isDate, soit une ISO 8601 avec fuseau ou heure.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function estDateChampReservation(value) {
  if (!estDateAccepteePourApi(value)) return false;
  const s = String(value).trim();
  if (validator.isDate(s)) return true;
  return validator.isISO8601(s, { strict: false });
}

/**
 * Même idée que le formulaire web, avec isStrongPassword du paquet validator.
 * minSymbols à zéro évite d'imposer un caractère spécial, ce qui suffit pour un TP.
 * On garde tout de même longueur minimale, majuscules, minuscules et chiffres.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function estMotDePasseFort(value) {
  if (typeof value !== "string") return false;
  return validator.isStrongPassword(value, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  });
}
