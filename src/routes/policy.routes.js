import {Router} from "express";
import {
    getAllPolicies,
    createOrUpdatePolicy,
    deletePolicy,
    getPolicy
} from "../controllers/policy.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// router.use(verifyJWT);

router.route("/")
    .get(getAllPolicies)
    .post(upload.single("policy"), createOrUpdatePolicy);

router.route("/:policyId")
    .delete(deletePolicy)
    .get(getPolicy)
    

export default router;