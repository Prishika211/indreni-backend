import {Router} from "express";
import { registerUser } from "../controllers/admin.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
const router = Router()

router.route("/register").post(registerUser)
export default router