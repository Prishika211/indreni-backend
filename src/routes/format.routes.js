import { Router } from "express";
import {
  getAllFormats,
  createFormat,
  updateFormat,
  deleteFormat,
  getFormat,
} from "../controllers/format.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// router.use(verifyJWT);

router
  .route("/")
  .get(getAllFormats)
  .post(upload.single("format"), createFormat);

router
  .route("/:formatId")
  .patch(upload.single("format"), updateFormat)
  .delete(deleteFormat)
  .get(getFormat);

export default router;
