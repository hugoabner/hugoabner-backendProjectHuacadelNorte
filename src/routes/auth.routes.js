import { Router } from "express";
import { deleteUser, getProfile, getUsers, signIn, signUp, updateUser} from '../controllers/auth.controller';
//import { checkRolesExisted, checkDuplicateUserNameOrEmail} from "../middlewares/index";
import { authJwtVerified, requireAuth, isAdmin } from "../middlewares/authorizations/auth.jwt.Verified";

const router = Router()

//[checkRolesExisted, checkDuplicateUserNameOrEmail]
router.post('/signIn',  signIn ); //finalizado
router.get('/profile', requireAuth,  getProfile)


/* Crud de usuarios registrados */
router.post('/signUp', [authJwtVerified, isAdmin], signUp ); //crear user
router.get('/userRegisters', [authJwtVerified, isAdmin], getUsers ); //obtener users
router.delete('/deleteUser/:userId', [authJwtVerified, isAdmin], deleteUser);//eliminar user
router.put('/updateUser/:userId', [authJwtVerified, isAdmin], updateUser);//actualizar user


export default router;