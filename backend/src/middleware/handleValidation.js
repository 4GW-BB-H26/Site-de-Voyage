/**
 * @fileoverview Suite à express-validator : centralise les réponses 400.
 */
import { validationResult } from "express-validator";

/**
 * Quand express-validator trouve des erreurs, on renvoie tout de suite un 400
 * avec le détail, plutôt que d’aller plus loin dans le contrôleur.
 */
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
