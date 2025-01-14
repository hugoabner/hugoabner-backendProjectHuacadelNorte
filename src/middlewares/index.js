import { authJwtVerified,isModerator, isAdmin } from "./authorizations/auth.jwt.Verified"; 
// import { isModerator, isAdmin } from "./authorizations/auth.jwt.Verified";
import { checkRolesExisted, checkDuplicateUserNameOrEmail } from "./authorizations/signUp.verified"; 


/* exportamos los middlewares*/
export { authJwtVerified, isModerator, isAdmin };
export { checkRolesExisted, checkDuplicateUserNameOrEmail };  