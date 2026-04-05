/**
 * Erreur opérationnelle attendue (validation, auth, ressource absente, etc.).
 * Le middleware global la transforme en JSON avec message et recouvrement.
 */
export class ErreurApplicative extends Error {
  /**
   * @param {string} message - Message affichable pour l’utilisateur ou le client API
   * @param {{ status?: number; code?: string; recouvrement?: string | null }} [options]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = "ErreurApplicative";
    this.status = options.status ?? 500;
    this.code = options.code ?? "ERREUR";
    this.recouvrement = options.recouvrement ?? null;
  }
}
