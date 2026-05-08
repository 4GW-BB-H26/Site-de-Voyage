//Config des params pour tokens de securités JWT en récupérant la clé (+ sa validité pour gérer les connexions des users)

//clé
const secretDepuisEnv = typeof process.env.JWT_SECRET === "string" ? process.env.JWT_SECRET.trim() : "";
//expiration
const expirationDepuisEnv = typeof process.env.JWT_EXPIRES_IN === "string"? process.env.JWT_EXPIRES_IN.trim() : "";

//export
export const jwtSecret = secretDepuisEnv || "dev-secret-a-changer-en-production";
export const jwtExpiresIn = expirationDepuisEnv || "7d";
