/** Importacion de los middleware @Authorizations */
import { authJwtVerified,
	requireAuth,
	isModerator, 
	isAdmin } from "./authorizations/auth.jwt.Verified"; 

import { checkRolesExisted, 
	checkDuplicateUserNameOrEmail } from "./authorizations/signUp.verified"; 


/**@Exportacion de los middleware */
export { authJwtVerified, 
	isModerator, 
	isAdmin,
	requireAuth };
	
export { checkRolesExisted, 
	checkDuplicateUserNameOrEmail };  