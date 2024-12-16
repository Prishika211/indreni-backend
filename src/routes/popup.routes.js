import { Router } from "express";
import {
    createPopup,
    getPopup,
    updatePopup,
    deletePopup,
} from "../controllers/popup.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Protect all routes with admin authentication
router.use(verifyJWT);

router.route("/")
    .get(getPopup) // Fetch the active popup
    .post(upload.single("photo"), createPopup); // Handle popup creation with image upload

router.route("/:popupId")
    .patch(upload.single("photo"), updatePopup) // Handle popup updates
    .delete(deletePopup); // Handle popup deletion

export default router;
