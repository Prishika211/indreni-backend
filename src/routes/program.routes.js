import { Router } from "express";
import {
    getAllPrograms,
    getPresentPrograms,
    getPastPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
} from "../controllers/program.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Protect all routes with admin authentication
router.use(verifyJWT);

router.route("/")
    .get(getAllPrograms)
    .post(upload.single("image"), createProgram);

router.route("/present")
    .get(getPresentPrograms);

router.route("/past")
    .get(getPastPrograms);

router.route("/:programId")
    .patch(upload.single("photo"), updateProgram)
    .delete(deleteProgram);

export default router;