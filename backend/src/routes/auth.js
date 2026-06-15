import express from "express"
import { signup ,login,logout,check} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createRateLimit } from "../middleware/rateLimit.js";

const router=express.Router();
const authRateLimit = createRateLimit({ windowMs: 60_000, max: 10 });
router.use(express.urlencoded({extended:true}));


router.post("/signup",authRateLimit,signup);

router.post("/login",authRateLimit,login);

router.delete("/logout",logout);

router.get("/validate",authMiddleware,check)



export default router
