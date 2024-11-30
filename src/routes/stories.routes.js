import { Router } from "express";
import {
    getAllStories,
    createStory,
    updateStory,
    deleteStory,
} from "../controllers/stories.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Protect all routes with admin authentication
router.use(verifyJWT);

router.route("/")
    .get(getAllStories)
    .post(upload.single("image"), createStory); // Handle image upload

router.route("/:storyId")
    .patch(upload.single("image"), updateStory) // Handle image upload
    .delete(deleteStory);

export default router;