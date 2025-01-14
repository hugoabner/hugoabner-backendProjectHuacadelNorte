import { ROLES } from '../../models/Role';
import User from '../../models/User';

export const checkDuplicateUserNameOrEmail = async (req, res , next) => {
	const user = await User.findOne({username: req.body.username})
	if (user) {
		return res.status(400).json({message: "El nombre de usuario ya existe"});
	}
	
	const email = await User.findOne({email: req.body.email});
	if (email) {
		return res.status(401).json({message:"El correo electronico ya existe"})
	}
	next();
}

//funcion para verificar si los roles existen para el usuario 
export const checkRolesExisted = (req, res, next) => {
	if (req.body.roles) { //si existe  req.body.roles
		for (let i = 0; i < req.body.roles.length; i++) {//mientras sea menor a la longitud del arreglo rrecorremos el arreglo de roles uno por uno  
			//por cada recorrido compramos el rol con el rol de la db
			if (!ROLES.includes(req.body.roles[i])) {//si el rol no existe 
				return res.status(400).json({
					message: `El rol ${req.body.roles[i]} no existe`
				})
			}
		}
	}
	//si el rol existe continua 
	next();
}

// //funcion para verificar si el usuario es admin y si es admin pasa a la siguiente funcion
// export const isAdmin = (req, res, next) => {
//     if (!req.body.roles || !req.body.roles.includes('admin')) { 
//         // Si no hay roles o no incluye el rol 'admin'
//         return res.status(403).json({ // Código de estado HTTP 403: Forbidden
//             message: 'Acceso denegado. Se requiere rol de administrador.'
//         });
//     }
//     // Si el usuario tiene rol de administrador
//     next();
// };