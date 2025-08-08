import { Router } from "express";
import { addToHistory, getUserHistory, login, register } from "../controller/user.controller.js";
import wrapasync from "../utils/wrapasync.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/login" , wrapasync(login));
router.post("/register",wrapasync(register));
router.post("/add_to_activity",authenticate, wrapasync(addToHistory));
router.get("/get_all_activity",authenticate,  wrapasync(getUserHistory));

export default router;
