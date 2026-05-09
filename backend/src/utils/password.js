import bcrypt from "bcryptjs";

//Les methodes bcrypt pour log in et hash un mdp

const TOURS_HACHAGE = 10;
const PREFIXE_BCRYPT = /^\$2[aby]\$/;

export async function hasherMotDePasse(motDePasseClair) {
  if (typeof motDePasseClair !== "string" || motDePasseClair.length === 0) {
    throw new TypeError("Le mot de passe doit être une chaîne non vide.");
  }
  return bcrypt.hash(motDePasseClair, TOURS_HACHAGE);
}

export async function verifierMotDePasseStocke(
  motDePasseClair,
  valeurStockeeBrute,
) {
  if (
    typeof motDePasseClair !== "string" ||
    valeurStockeeBrute == null ||
    valeurStockeeBrute === ""
  ) {
    return { valide: false, necessiteRehachage: false };
  }
  const stocke =
    typeof valeurStockeeBrute === "string"
      ? valeurStockeeBrute.trim()
      : String(valeurStockeeBrute).trim();
  if (!stocke) {
    return { valide: false, necessiteRehachage: false };
  }
  try {
    if (PREFIXE_BCRYPT.test(stocke)) {
      const valide = await bcrypt.compare(motDePasseClair, stocke);
      return { valide, necessiteRehachage: false };
    }
    const valide = motDePasseClair === stocke;
    return { valide, necessiteRehachage: valide };
  } catch {
    return { valide: false, necessiteRehachage: false };
  }
}
