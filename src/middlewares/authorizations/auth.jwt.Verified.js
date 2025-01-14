import JWT from "jsonwebtoken";
import User from "../../models/User";
import Role from "../../models/Role";
//funcion para verificar el token 
export const authJwtVerified = async (req, res, next) => {
	try {
		const token = req.headers["x-access-token"]; //agregamos el token en el header para acceder a el
		// console.log(token);
		if (!token) {
			return res.status(403).json({message: "No se ha proporcionado un token"});	
		}
		//aqui decodificamos el token
		const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY); //decodificamos el token con la llave secreta
		req.userId = decoded.id;
		const user = await User.findById(req.userId, {password: 0}).populate("roles");
		console.log(user);
		if (!user) {
			return res.status(404).json({message: "El usuario no ha sido encontrado"});		
		}
	 	// console.log(decoded);
		next();
		
	} catch (error) {
		return res.status(401).json({message: "No esta Autorizado"});
		console.log("error en la funcion authJwtVerified " + error);
	}
}

//creamos una funcion para verificar si el usuario es moderador
//si no es moderador se devuelve un error 
//si es moderador se pasa as siguiente funcion
export const isModerator = async (req, res, next) => {
	try {
	const user = await User.findById(req.userId)
	const roles = await Role.find({_id: {$in: user.roles}})
	
	for (let i = 0; i < roles.length; i++) {
		if (roles[i].name === "moderator") {
			next();
			return;
		}
	}
	// return res.status(403).json({message: "Se requiere rol de moderador"})
	// console.log(roles);	
	} catch (error) {
		console.log(error);
		return res.status(401).json({message: "Se requiere rol de moderador"});
	}
}

//funciones para verificar si existe el usuario y si es admin
export const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId)
		const roles = await Role.find({_id: {$in: user.roles}})
		
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "admin") {
				next();
				return;
			}
		}
		//return res.status(403).json({message: "Se requiere rol de admin"})
		console.log(roles);
		console.log(user);
	} catch (error) {
		console.log(error);
		return res.status(401).json({message: "Se requiere rol de admin"});
		
	}
	
}



//funcion para verificar si el usuario esta logueado y obtener su informacion 
export const requireAuth = async (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(" ")[1];//el operador split se usa para separar el token de la palabra Bearer
		const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
		req.userId = decoded.id;
		const user = await User.findById(req.userId, {password: 0}).populate("roles"); //obtenemos la informacion del usuario sin la contraseña
		if (!user) {
			return res.status(404).json({message: "El usuario no ha sido encontrado"});		
		}
		next();
	} else {
		return res.status(401).json({message: "No esta Autorizado"});
	}
}

//funcion para ver si el token se ha modificado 
// export const authMiddleware = async (req, res, next) => {
// 	const authHeader = req?.headers?.authorization; // Corregido aquí

// 	if (!authHeader || !authHeader.startsWith("Bearer")) {
// 		return next("Authentication failed");
// 	}

// 	const token = authHeader.split(" ")[1];

// 	try {
// 		const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

// 		req.body.user = {
// 			userId: userToken.userId,
// 		};
		
// 		next();
// 	} catch (error) {
// 		console.log(error);
// 		next("Authentication failed");
// 	}
// };