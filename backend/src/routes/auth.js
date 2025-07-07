import express from "express"
import { signup ,login,logout,check} from "../controllers/authController.js";

const router=express.Router();
router.use(express.urlencoded({extended:true}));


router.post("/signup",signup);

router.post("/login",login);

router.delete("/logout",logout);

router.get("/validate",check)



export default router