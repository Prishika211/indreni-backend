import { Router } from "express";
import {
  getAllPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getPublication,
} from "../controllers/publication.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// router.use(verifyJWT);

router
  .route("/")
  .get(getAllPublications)
  .post(upload.single("publication"), createPublication);

router
  .route("/:publicationId")
  .patch(upload.single("publication"), updatePublication)
  .delete(deletePublication)
  .get(getPublication);

export default router;
