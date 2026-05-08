/**
 * Règles express-validator regroupées par domaine fonctionnel.
 *
 * Dans une route Express, on branche en général le parseur JSON sur le corps,
 * puis un ou plusieurs tableaux exportés par ce fichier,
 * puis handleValidationErrors pour renvoyer un 400 avec le détail si une règle échoue,
 * puis les middlewares métier comme le JWT,
 * puis enfin le contrôleur.
 *
 * Les règles un peu lourdes sur les dates de réservation, le mot de passe fort
 * et le motif Bearer pour le JWT vivent dans le fichier utils validator.
 */
import { body, param, query, header, oneOf } from "express-validator";
import {
  estDateChampReservation,
  estMotDePasseFort,
  REGEX_AUTHORIZATION_BEARER,
} from "../utils/validator.js";

/**
 * Vérifie la présence et la forme minimale de l'en-tête Authorization pour le JWT.
 * À placer avant exigerJetonValide, ainsi on renvoie vite un 400 si la requête est mal formée,
 * et le middleware JWT continue de renvoyer un 401 si le jeton manque ou est invalide.
 */
export const authorizationBearerValidators = [
  header("authorization")
    .exists({ checkFalsy: true })
    .withMessage("Jeton d'authentification requis.")
    .matches(REGEX_AUTHORIZATION_BEARER)
    .withMessage("Format attendu : « Bearer <jeton> »."),
];

// --- Connexion, inscription, profil (routes /user, /auth, /users) ---

/** GET avec identifiants en query, peu utilisé si le front passe par POST auth login. */
export const getUserQueryValidators = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Courriel requis.")
    .isEmail()
    .withMessage("Courriel invalide."),
  query("password").notEmpty().withMessage("Mot de passe requis."),
];

/** Connexion JSON, courriel passé au trim, mot de passe obligatoire. */
export const postAuthLoginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Courriel requis.")
    .isEmail()
    .withMessage("Courriel invalide."),
  body("password")
    .isString()
    .withMessage("Mot de passe requis.")
    .notEmpty()
    .withMessage("Mot de passe requis."),
];

/** Inscription, champs profil, normalizeEmail sur le courriel, mot de passe fort via estMotDePasseFort. */
export const postUsersValidators = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis.")
    .isLength({ max: 200 })
    .withMessage("Le prénom est trop long."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ max: 200 })
    .withMessage("Le nom est trop long."),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Le nom d'utilisateur est requis.")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Le nom d'utilisateur doit contenir entre 2 et 100 caractères.",
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Le courriel est requis.")
    .isEmail()
    .withMessage("Courriel invalide.")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Le mot de passe est requis.")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .custom(estMotDePasseFort)
    .withMessage(
      "Mot de passe trop faible : au moins 8 caractères avec majuscule, minuscule et chiffre.",
    ),
];

/**
 * Mise à jour du profil, le mot de passe est facultatif.
 * S'il est envoyé, on applique la même règle de robustesse qu'à l'inscription.
 */
export const putUserValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant utilisateur invalide."),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis.")
    .isLength({ max: 200 }),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ max: 200 }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Le nom d'utilisateur est requis.")
    .isLength({ min: 2, max: 100 }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Le courriel est requis.")
    .isEmail()
    .withMessage("Courriel invalide.")
    .normalizeEmail(),
  body("password")
    .optional({ values: "falsy" })
    .isString()
    .custom(estMotDePasseFort)
    .withMessage(
      "Mot de passe trop faible : au moins 8 caractères avec majuscule, minuscule et chiffre.",
    ),
];

/** Suppression de compte, seul l'identifiant numérique dans l'URL est validé ici. */
export const deleteUserValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant utilisateur invalide."),
];

// --- Réservations (Oracle) ---

/** Liste des réservations par utilisateur, paramètre userId dans l'URL. */
export const reservationUserIdParamValidators = [
  param("userId")
    .isInt({ min: 1 })
    .withMessage("Identifiant utilisateur invalide."),
];

/** Détail, annulation ou suppression d'une réservation, identifiant numérique dans l'URL. */
export const reservationIdParamValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant de réservation invalide."),
];

/**
 * Corps attendu par createReservation, insert Oracle explicite dans le contrôleur.
 * Les dates sont validées avec estDateChampReservation, date simple ou ISO 8601.
 */
export const postReservationValidators = [
  body("id_reservation")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("id_reservation doit être un entier positif."),
  body("reference_number")
    .customSanitizer((v) => (v == null ? "" : String(v)))
    .trim()
    .notEmpty()
    .withMessage("reference_number est requis.")
    .isLength({ max: 100 }),
  body("date_start")
    .trim()
    .notEmpty()
    .withMessage("date_start est requis.")
    .custom(estDateChampReservation)
    .withMessage(
      "date_start doit être une date valide (AAAA-MM-JJ, ou date reconnue par isDate, ou ISO 8601).",
    ),
  body("date_end")
    .trim()
    .notEmpty()
    .withMessage("date_end est requis.")
    .custom(estDateChampReservation)
    .withMessage(
      "date_end doit être une date valide (AAAA-MM-JJ, ou date reconnue par isDate, ou ISO 8601).",
    ),
  body("nb_travelers")
    .isInt({ min: 1 })
    .withMessage("nb_travelers doit être un entier ≥ 1."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("price doit être un nombre positif."),
  body("status").optional({ values: "falsy" }).trim().isLength({ max: 50 }),
  body("users_id_users")
    .isInt({ min: 1 })
    .withMessage("users_id_users doit être un entier positif."),
  body("trip_id_trip")
    .isInt({ min: 1 })
    .withMessage("trip_id_trip doit être un entier positif."),
  body("id_trip")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("id_trip doit être un entier positif."),
];

// --- Favoris (Mongo) ---

/** Création d'un favori, identifiants utilisateur et destination numériques côté Oracle. */
export const postFavoriteValidators = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("userId est requis.")
    .matches(/^\d+$/)
    .withMessage("userId doit être un identifiant numérique."),
  body("destinationId")
    .trim()
    .notEmpty()
    .withMessage("destinationId est requis.")
    .matches(/^\d+$/)
    .withMessage("destinationId doit être un identifiant numérique."),
  body("nomDestination")
    .trim()
    .notEmpty()
    .withMessage("nomDestination est requis.")
    .isLength({ max: 300 }),
];

/** Paramètre de route id, doit être un ObjectId MongoDB valide. */
export const mongoIdParamValidators = [
  param("id").isMongoId().withMessage("Identifiant MongoDB invalide."),
];

/** Mise à jour d'un favori, au moins nomDestination ou destinationId doit être non vide. */
export const favoriteUpdateValidators = [
  param("id").isMongoId().withMessage("Identifiant MongoDB invalide."),
  oneOf(
    [
      body("nomDestination").trim().notEmpty(),
      body("destinationId").trim().notEmpty(),
    ],
    {
      message: "Fournir au moins nomDestination ou destinationId (non vide).",
    },
  ),
];

/** Liste des favoris d'un utilisateur, userId numérique dans l'URL. */
export const favoritesUserIdParamValidators = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("userId est requis.")
    .matches(/^\d+$/)
    .withMessage("userId doit être un identifiant numérique."),
];

// --- Commentaires (Mongo) ---

/** Nouveau commentaire, textes avec longueur max, note optionnelle entre 1 et 5. */
export const postCommentValidators = [
  body("destinationId")
    .trim()
    .notEmpty()
    .withMessage("destinationId est requis.")
    .isLength({ max: 200 }),
  body("auteur")
    .trim()
    .notEmpty()
    .withMessage("auteur est requis.")
    .isLength({ max: 200 }),
  body("texte")
    .trim()
    .notEmpty()
    .withMessage("texte est requis.")
    .isLength({ max: 4000 }),
  body("note")
    .optional({ values: "null" })
    .isInt({ min: 1, max: 5 })
    .withMessage("note doit être entre 1 et 5."),
];

/** Liste des commentaires pour une destination, identifiant libre ou clé métier en chaîne. */
export const commentsDestinationParamValidators = [
  param("destId").trim().notEmpty().withMessage("destId est requis."),
];

/** Mise à jour partielle, au moins un parmi auteur, texte ou note. */
export const commentUpdateValidators = [
  param("id").isMongoId().withMessage("Identifiant MongoDB invalide."),
  oneOf(
    [
      body("auteur").trim().notEmpty(),
      body("texte").trim().notEmpty(),
      body("note").isInt({ min: 1, max: 5 }),
    ],
    {
      message: "Fournir auteur, texte ou note à modifier.",
    },
  ),
];

// --- Packages & destinations (Oracle / TAPI) ---

/** Lecture ou suppression d'un package, identifiant entier dans l'URL. */
export const packageIdParamValidators = [
  param("id").isInt({ min: 1 }).withMessage("Identifiant de package invalide."),
];

/**
 * Création ou mise à jour de package, beaucoup de champs optionnels pour coller au TAPI et au camelCase.
 * Les longueurs max et les types numériques limitent les envois trop gros ou incohérents.
 */
export const postPackageValidators = [
  body("hotel_name").optional().isString().isLength({ max: 500 }),
  body("excursion").optional().isString().isLength({ max: 2000 }),
  body("transport_type").optional().isString().isLength({ max: 100 }),
  body("guide_name").optional().isString().isLength({ max: 200 }),
  body("length").optional().isInt({ min: 0 }),
  body("global_rating").optional().isFloat({ min: 0, max: 5 }),
  body("nb_ratings").optional().isInt({ min: 0 }),
  body("description").optional().isString().isLength({ max: 4000 }),
  body("price").optional().isFloat({ min: 0 }),
  body("destination_id_destination")
    .optional({ values: "null" })
    .isInt({ min: 1 }),
  body("id_destination").optional({ values: "null" }).isInt({ min: 1 }),
  body("hotelName").optional().isString().isLength({ max: 500 }),
  body("transportType").optional().isString(),
  body("guideName").optional().isString(),
  body("globalRating").optional().isFloat({ min: 0, max: 5 }),
  body("nbRatings").optional().isInt({ min: 0 }),
  body("destinationId").optional({ values: "null" }).isInt({ min: 1 }),
  body("idDestination").optional({ values: "null" }).isInt({ min: 1 }),
];

/** Mise à jour package, id dans l'URL et mêmes règles que la création pour le corps. */
export const putPackageValidators = [
  ...packageIdParamValidators,
  ...postPackageValidators,
];

/** Identifiant de destination en route, chaîne non vide selon la convention TAPI et la base. */
export const destinationIdParamValidators = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Identifiant de destination requis."),
];

/**
 * Création destination, ville et pays obligatoires.
 * Les liens d'image sont optionnels, on accepte les valeurs vides et sinon une URL http ou https.
 */
export const postDestinationValidators = [
  body("city")
    .trim()
    .notEmpty()
    .withMessage("city est requis.")
    .isLength({ max: 200 }),
  body("country")
    .trim()
    .notEmpty()
    .withMessage("country est requis.")
    .isLength({ max: 200 }),
  body("image_link")
    .optional({ values: "falsy" })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
    })
    .withMessage("image_link doit être une URL http(s) valide.")
    .isLength({ max: 2000 })
    .withMessage("image_link est trop long."),
  body("imageLink")
    .optional({ values: "falsy" })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
    })
    .withMessage("imageLink doit être une URL http(s) valide.")
    .isLength({ max: 2000 })
    .withMessage("imageLink est trop long."),
];

/** Mise à jour destination, même schéma que la création avec l'id dans l'URL. */
export const putDestinationValidators = [
  ...destinationIdParamValidators,
  body("city")
    .trim()
    .notEmpty()
    .withMessage("city est requis.")
    .isLength({ max: 200 }),
  body("country")
    .trim()
    .notEmpty()
    .withMessage("country est requis.")
    .isLength({ max: 200 }),
  body("image_link")
    .optional({ values: "falsy" })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
    })
    .withMessage("image_link doit être une URL http(s) valide.")
    .isLength({ max: 2000 })
    .withMessage("image_link est trop long."),
  body("imageLink")
    .optional({ values: "falsy" })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      require_valid_protocol: true,
    })
    .withMessage("imageLink doit être une URL http(s) valide.")
    .isLength({ max: 2000 })
    .withMessage("imageLink est trop long."),
];
