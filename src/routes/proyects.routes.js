

import { Router } from "express";
import { createProyect,
		getProyect,
		getProyectById,
		updateProyectById,
		deleteProyectById } from "../controllers/proyects.controller";
import {authJwtVerified,
		isAdmin,
		isModerator}  from "../middlewares/index";
const router = Router()

router.post('/createProject', [authJwtVerified, isAdmin],  createProyect);
router.get('/getProject', [authJwtVerified, isAdmin], getProyect);
router.put('/:proyectId', [authJwtVerified, isAdmin], updateProyectById);
router.delete('/:proyectId', [authJwtVerified, isAdmin],  deleteProyectById);
router.get('/:proyectId', getProyectById);


export default router;