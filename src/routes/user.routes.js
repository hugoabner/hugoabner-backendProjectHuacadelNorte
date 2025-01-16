import { Router  } from "express";
import { createUser } from '../controllers/index';
import { authJwtVerified, isAdmin} from '../middlewares/index';
import { checkRolesExisted } from "../middlewares/index";
import { checkDuplicateUserNameOrEmail } from "../middlewares/index";

const router = Router()

router.post('/', [authJwtVerified, isAdmin, checkRolesExisted,checkDuplicateUserNameOrEmail ], createUser )

export default router;