/**
 * Règles express-validator regroupées par domaine.
 * Chaque export est une chaîne à passer aux routes avant le contrôleur,
 * suivie de handleValidationErrors pour renvoyer un 400 si besoin.
 */
import {
  body,
  param,
  query,
  oneOf,
} from "express-validator";

// --- Connexion, inscription, profil (routes /user, /auth, /users) ---

export const getUserQueryValidators = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Courriel requis.")
    .isEmail()
    .withMessage("Courriel invalide."),
  query("password")
    .notEmpty()
    .withMessage("Mot de passe requis."),
];

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
    .withMessage("Le nom d'utilisateur doit contenir entre 2 et 100 caractères."),
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
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
];

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
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères."),
];

export const deleteUserValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant utilisateur invalide."),
];

// --- Réservations (Oracle) ---

export const reservationUserIdParamValidators = [
  param("userId")
    .isInt({ min: 1 })
    .withMessage("Identifiant utilisateur invalide."),
];

export const reservationIdParamValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant de réservation invalide."),
];

// Corps complet attendu par createReservation (Oracle INSERT explicite)
export const postReservationValidators = [
  body("id_reservation")
    .isInt({ min: 1 })
    .withMessage("id_reservation doit être un entier positif."),
  body("reference_number")
    .customSanitizer((v) => (v == null ? "" : String(v)))
    .trim()
    .notEmpty()
    .withMessage("reference_number est requis.")
    .isLength({ max: 100 }),
  body("reservation_date")
    .notEmpty()
    .withMessage("reservation_date est requis.")
    .custom((v) => !Number.isNaN(new Date(v).getTime()))
    .withMessage("reservation_date doit être une date valide."),
  body("date_start")
    .notEmpty()
    .withMessage("date_start est requis.")
    .custom((v) => !Number.isNaN(new Date(v).getTime()))
    .withMessage("date_start doit être une date valide."),
  body("date_end")
    .notEmpty()
    .withMessage("date_end est requis.")
    .custom((v) => !Number.isNaN(new Date(v).getTime()))
    .withMessage("date_end doit être une date valide."),
  body("nb_travelers")
    .isInt({ min: 1 })
    .withMessage("nb_travelers doit être un entier ≥ 1."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("price doit être un nombre positif."),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("status est requis.")
    .isLength({ max: 50 }),
  body("users_id_users")
    .isInt({ min: 1 })
    .withMessage("users_id_users doit être un entier positif."),
  body("trip_id_trip")
    .isInt({ min: 1 })
    .withMessage("trip_id_trip doit être un entier positif."),
  body("id_trip")
    .isInt({ min: 1 })
    .withMessage("id_trip doit être un entier positif."),
];

// --- Favoris (Mongo) ---

export const postFavoriteValidators = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("userId est requis."),
  body("destinationId")
    .trim()
    .notEmpty()
    .withMessage("destinationId est requis."),
  body("nomDestination")
    .trim()
    .notEmpty()
    .withMessage("nomDestination est requis.")
    .isLength({ max: 300 }),
];

export const mongoIdParamValidators = [
  param("id")
    .isMongoId()
    .withMessage("Identifiant MongoDB invalide."),
];

export const favoriteUpdateValidators = [
  param("id")
    .isMongoId()
    .withMessage("Identifiant MongoDB invalide."),
  oneOf(
    [
      body("nomDestination").trim().notEmpty(),
      body("destinationId").trim().notEmpty(),
    ],
    {
      message:
        "Fournir au moins nomDestination ou destinationId (non vide).",
    }
  ),
];

export const favoritesUserIdParamValidators = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("userId est requis."),
];

// --- Commentaires (Mongo) ---

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

export const commentsDestinationParamValidators = [
  param("destId")
    .trim()
    .notEmpty()
    .withMessage("destId est requis."),
];

export const commentUpdateValidators = [
  param("id")
    .isMongoId()
    .withMessage("Identifiant MongoDB invalide."),
  oneOf(
    [
      body("auteur").trim().notEmpty(),
      body("texte").trim().notEmpty(),
      body("note").isInt({ min: 1, max: 5 }),
    ],
    {
      message: "Fournir auteur, texte ou note à modifier.",
    }
  ),
];

// --- Packages & destinations (Oracle / TAPI) ---

export const packageIdParamValidators = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Identifiant de package invalide."),
];

export const postPackageValidators = [
  body("hotel_name")
    .optional()
    .isString()
    .isLength({ max: 500 }),
  body("excursion")
    .optional()
    .isString()
    .isLength({ max: 2000 }),
  body("transport_type")
    .optional()
    .isString()
    .isLength({ max: 100 }),
  body("guide_name")
    .optional()
    .isString()
    .isLength({ max: 200 }),
  body("length")
    .optional()
    .isInt({ min: 0 }),
  body("global_rating")
    .optional()
    .isFloat({ min: 0, max: 5 }),
  body("nb_ratings")
    .optional()
    .isInt({ min: 0 }),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 4000 }),
  body("price")
    .optional()
    .isFloat({ min: 0 }),
  body("destination_id_destination")
    .optional({ values: "null" })
    .isInt({ min: 1 }),
  body("id_destination")
    .optional({ values: "null" })
    .isInt({ min: 1 }),
  body("hotelName")
    .optional()
    .isString()
    .isLength({ max: 500 }),
  body("transportType")
    .optional()
    .isString(),
  body("guideName")
    .optional()
    .isString(),
  body("globalRating")
    .optional()
    .isFloat({ min: 0, max: 5 }),
  body("nbRatings")
    .optional()
    .isInt({ min: 0 }),
  body("destinationId")
    .optional({ values: "null" })
    .isInt({ min: 1 }),
  body("idDestination")
    .optional({ values: "null" })
    .isInt({ min: 1 }),
];

export const putPackageValidators = [
  ...packageIdParamValidators,
  ...postPackageValidators,
];

export const destinationIdParamValidators = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Identifiant de destination requis."),
];

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
    .optional({ values: "null" })
    .isString()
    .isLength({ max: 2000 }),
  body("imageLink")
    .optional({ values: "null" })
    .isString()
    .isLength({ max: 2000 }),
];

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
    .optional({ values: "null" })
    .isString()
    .isLength({ max: 2000 }),
  body("imageLink")
    .optional({ values: "null" })
    .isString()
    .isLength({ max: 2000 }),
];
