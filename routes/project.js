import { Router } from "express";
import upload from "../middlewares/upload.js";
import {
  deleteProject,
  formEditProject,
  formProject,
  insertProject,
  updateProject,
} from "../controllers/projectController.js";
import { cekLogin } from "../middlewares/auth.js";

const router = Router();

router.get("/formProject", cekLogin, formProject);
router.get("/formEditProject/:id", cekLogin, formEditProject);

router.post("/addProject", cekLogin, upload.single("image"), insertProject);
router.post("/editProject/:id", cekLogin, upload.single("image"), updateProject);
router.post("/deleteProject/:id", deleteProject);


export default router;
