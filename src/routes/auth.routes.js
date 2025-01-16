import { Router } from "express";

import { deleteUser, 
	getProfile, 
	getUsers, 
	signIn, 
	signUp, 
	updateUser} from '../controllers/auth.controller';
	
import {authJwtVerified, 
	requireAuth, 
	isAdmin} from '../middlewares/index'; 

const router = Router()

/**@Route para iniciar sesion */
router.post('/signIn',  
	signIn);

/**@Route para obtener el perfil */
router.get('/profile', 
	requireAuth,  
	getProfile)

/**@Route para registrar un usuario */
router.post('/signUp', 
	[authJwtVerified, isAdmin], 
	signUp );

/**@Route para usuarios registrados */
router.get('/userRegisters', 
	[authJwtVerified, isAdmin], 
	getUsers );

/**@Route para eliminar un usuario */
router.delete('/deleteUser/:userId', 
	[authJwtVerified, isAdmin], 
	deleteUser);

/**@Route para actualizar un usuario */
router.put('/updateUser/:userId', 
	[authJwtVerified, isAdmin], 
	updateUser);


export default router;