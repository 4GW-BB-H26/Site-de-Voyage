//les routes API pour la collection comments

import { Router } from "express";
import {
  addComment,
  getCommentsByDestination,
  getCommentById,
  updateComment,
  removeComment,
} from "../controllers/comments.js";
import { asyncHandler } from "../middleware/error_middleware.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import {
  postCommentValidators,
  commentsDestinationParamValidators,
  mongoIdParamValidators,
  commentUpdateValidators,
} from "../validators/index.js";

const router = Router();

router.post(
  "/comments",
  postCommentValidators,
  handleValidationErrors,
  asyncHandler(addComment),
);
router.get(
  "/comments/destination/:destId",
  commentsDestinationParamValidators,
  handleValidationErrors,
  asyncHandler(getCommentsByDestination),
);
router.get(
  "/comments/:id",
  mongoIdParamValidators,
  handleValidationErrors,
  asyncHandler(getCommentById),
);
router.put(
  "/comments/:id",
  commentUpdateValidators,
  handleValidationErrors,
  asyncHandler(updateComment),
);
router.delete(
  "/comments/:id",
  mongoIdParamValidators,
  handleValidationErrors,
  asyncHandler(removeComment),
);

export default router;
