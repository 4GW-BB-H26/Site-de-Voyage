export class ErreurApplicative extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ErreurApplicative";
    this.status = options.status ?? 500;
    this.code = options.code ?? "ERREUR";
    this.recouvrement = options.recouvrement ?? null;
  }
}
