import { Router } from "express";
import {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
  getNotice,
} from "../controllers/notice.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// router.use(verifyJWT);
router.route("/").get(getAllNotices).post(upload.single("image"), createNotice); // Handle image upload

router
  .route("/:noticeId")
  .patch(upload.single("image"), updateNotice) // Handle image upload
  .delete(deleteNotice)
  .get(getNotice);

export default router;
