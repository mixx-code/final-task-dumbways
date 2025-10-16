import { Router } from "express";
import { deleteExperience, formEditExperience, formExperience, insertExperience, updateExperience } from "../controllers/experienceController.js"
import upload from "../middlewares/upload.js";
import { cekLogin } from "../middlewares/auth.js";

const router = Router()

router.get("/formExperience", cekLogin, formExperience);
router.get("/formEditExperience/:id", cekLogin,  formEditExperience);
router.post("/addExperience", cekLogin, upload.single("image"), insertExperience);
router.post("/editExperience/:id", cekLogin, upload.single("image"), updateExperience);
router.post("/deleteExperience/:id", cekLogin, deleteExperience);
export default router