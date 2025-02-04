import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//Ensure all routes are protected by admin authentication
// router.use(verifyJWT);

router
  .route("/")
  .get(getEmployees)
  .post(upload.single("photo"), createEmployee);

router
  .route("/:employeeId")
  .patch(upload.single("photo"), updateEmployee)
  .delete(deleteEmployee);

export default router;
