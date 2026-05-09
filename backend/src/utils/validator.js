//les methodes du validator

import validator from "validator";

export const REGEX_AUTHORIZATION_BEARER = /^Bearer\s+.+$/i;

export function estDateAccepteePourApi(value) {
  if (value == null) return false;
  const s = String(value).trim();
  if (s === "") return false;
  if (validator.isISO8601(s, { strict: false })) return true;
  if (validator.isDate(s)) return true;
  const t = Date.parse(s);
  return !Number.isNaN(t);
}

export function estDateChampReservation(value) {
  if (!estDateAccepteePourApi(value)) return false;
  const s = String(value).trim();
  if (validator.isDate(s)) return true;
  return validator.isISO8601(s, { strict: false });
}

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
