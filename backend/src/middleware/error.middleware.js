export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route introuvable" });
}

export function errorHandler(err, req, res, _next) {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
}
