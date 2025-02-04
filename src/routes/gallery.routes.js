import { Router } from "express";
import {
  addImagesToGallery,
  removeGalleryImage,
  getAllGalleryImages,
} from "../controllers/gallery.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Protect all routes with admin authentication
// router.use(verifyJWT);

router
  .route("/")
  .get(getAllGalleryImages)
  .post(upload.single("image"), addImagesToGallery); // Handle image upload

router.route("/:galleryId").delete(removeGalleryImage);

export default router;
