import { Router } from "express";
import {
  addSliderImage,
  removeSliderImage,
  getAllSliderImages,
  updateDisplayOrder,
} from "../controllers/slider.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router = Router();

// router.use(verifyJWT);

router
  .route("/")
  .get(getAllSliderImages)
  .post(upload.single("image"), addSliderImage);

router.route("/:sliderId").delete(removeSliderImage);

router.route("/:sliderId/display-order").patch(updateDisplayOrder);

export default router;
