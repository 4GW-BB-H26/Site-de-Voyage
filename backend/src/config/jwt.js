const secretDepuisEnv =
  typeof process.env.JWT_SECRET === "string" ? process.env.JWT_SECRET.trim() : "";
const expirationDepuisEnv =
  typeof process.env.JWT_EXPIRES_IN === "string"
    ? process.env.JWT_EXPIRES_IN.trim()
    : "";

export const jwtSecret = secretDepuisEnv || "dev-secret-a-changer-en-production";
export const jwtExpiresIn = expirationDepuisEnv || "7d";
