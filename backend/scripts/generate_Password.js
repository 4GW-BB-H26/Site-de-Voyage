//Ce script n'a qu'une seul utilitee et c'est de hasher le mot de passe du compte mis manuellement dans la bd

import { hasherMotDePasse } from "../src/utils/password.js";

const password = "LeCompteDeTest123";
const hash = await hasherMotDePasse(password);
console.log(hash);

//resultat: $2b$10$ik6XKD2DMynj1gjcQKIOUe8Nl/DwHlMRDA5O3yOiX/f1xq7E6ycNi