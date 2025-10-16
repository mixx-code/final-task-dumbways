import { Router } from "express";

import { login, logout, prosesLogin } from "../controllers/authController.js";

const router = Router()

router.get('/login', login)
router.post('/prosesLogin', prosesLogin)
router.post("/logout", logout);
export default router;