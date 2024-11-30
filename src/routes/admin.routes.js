import {Router} from "express";
import { loginAdmin, registerAdmin, logoutAdmin, refreshAccessToken} from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)


//secured routes
router.route("/logout").post(verifyJWT, logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)
export default router