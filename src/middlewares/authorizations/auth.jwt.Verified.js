import JWT from "jsonwebtoken";
import User from "../../models/User";
import Role from "../../models/Role";


/**@funcion para verificar el token */  
export const authJwtVerified = async (req, res, next) => {
	try {
		const token = req.headers["x-access-token"];
		if (!token) {
			return res.status(403).json(
				{message: "No se ha proporcionado un token"}
			);	
		}
		const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
		req.userId = decoded.id;
		const user = await User.findById(req.userId, {password: 0}).populate("roles");
		console.log(user);
		if (!user) {
			return res.status(404).json(
				{message: "El usuario no ha sido encontrado"}
			);		
		}
		next();
	} catch (error) {
		console.log("Ocurrio un error al verificar el token " + error);
		return res.status(401).json({message: "No esta Autorizado"});
	}
}

/**@Middleware para verificar si el usuario es moderador */
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
	} catch (error) {
		console.log(error);
		return res.status(401).json(
			{message: "Se requiere rol de moderador"}
		);
	}
}

/**@Middleware para verificar si el usuario es admin */
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
		console.log(roles);
		console.log(user);
	} catch (error) {
		console.log(error);
		return res.status(401).json(
			{message: "Se requiere rol de admin"}
		);
	}
}

/**@Middleware para verificar el token */
export const requireAuth = async (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
		req.userId = decoded.id;
		const user = await User.findById(req.userId, {password: 0}).populate("roles"); 
		if (!user) {
			return res.status(404).json(
				{message: "El usuario no ha sido encontrado"}
			);		
		}
		next();
	} else {
		return res.status(401).json(
			{message: "No esta Autorizado"}
		);
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