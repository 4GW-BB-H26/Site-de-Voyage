export const jwtSecret =
  process.env.JWT_SECRET || "dev-secret-a-changer-en-production";
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
