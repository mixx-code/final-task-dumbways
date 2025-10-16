import { Router } from "express";
import { home } from "../controllers/homeController.js"
// import { cekLogin } from "../middlewares/auth.js";
const router = Router()

router.get('/', home)

export default router