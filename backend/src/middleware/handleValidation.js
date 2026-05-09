import { validationResult } from "express-validator";

//validation des donnees transmises

export function handleValidationErrors(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array();
  const first = errors[0];
  const message =
    typeof first?.msg === "string"
      ? first.msg
      : "Un ou plusieurs champs ne sont pas valides.";

  return res.status(400).json({
    success: false,
    message,
    errors,
  });
}
