import User from '../../models/User';
import JWT from 'jsonwebtoken';
import Role from '../../models/Role';
import CryptoJS from 'crypto-js';

/**@funcion para Iniciar Sesion*/
export const signIn = async (req, res) => {
	try {
		const userFound =  await User.findOne({
			email: req.body.email
		}).populate("roles");
		if (!userFound){
			return res.status(400).json({
			message: "El usuario no existe"});
		}
		const matchPassword = await User.comparePassword(
			req.body.password, userFound.password
		);
		if (!matchPassword){
			return res.status(401).json({
			token: null, 
			message: "La contraseña es incorrecta"});
		}
		const rolesAsString = Array.isArray(userFound.roles)
		? userFound.roles.map((role) => role.name).join(', ')
		: userFound.roles.name;
		const token = JWT.sign({id: userFound._id}, 
		process.env.JWT_SECRET_KEY, {
		expiresIn: 86400 // el token expirara 24 horas
		})
		res.json({
			message: 'Su sesión se ha iniciado correctamente',
			user: {
			id: userFound._id,
			username: userFound.username,
			email: userFound.email,
			roles: 	rolesAsString,
			imgURL: userFound.imgURL
		},
		token,
		});
	} catch (error) {
		console.log("Ocurrio un error al iniciar sesion " + error);
	}
}

/**@funcion para obtener el perfil del usuario*/
export const getProfile = async (req, res) => {
	try {
		const userProfile = await User.findOne({
			_id: req.userId,
		}).populate("roles", "-__v");
		res.status(200).json({
			id: userProfile._id,
			username: userProfile.username,
			email: userProfile.email,
			roles: userProfile.roles
		})  
	} catch (error) {
		console.log("Ocurrio un error al obtener el perfil " + error);
	}
}	

/**@funcion para registrar un nuevo usuario*/
export const signUp = async (req, res) => {
	try {
		const { username, email, password, roles, imgURL } = req.body;
		const newUser = new User({
		username, email,
		password: await User.encryptPassword(password),
		imgURL,
		});
		if (roles && roles.length > 0) {
		const roleNames = roles.map((role) => (
			typeof role === "string" ? role : role.name
		));
		const foundRoles = await Role.find({
			name: { $in: roleNames } 
		});
		newUser.roles = foundRoles.map((role) => role._id);
		} else {
			const roleDefault = await Role.findOne({ name: "user" });
			newUser.roles = [roleDefault._id];
		}
		const savedUser = await newUser.save();
		const token = JWT.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: 86400, // 24 horas
		});
		res.status(200).json({ user: savedUser });
		console.log(savedUser);
	} catch (error) {
		console.error(error);	
	}
	
};
  
/**@funcion para obtener a todos los usuarios registrados */
export const getUsers = async (req, res) => {
	try {
		const users = await User.find().populate("roles", "-__v");
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ 
			message: "Error al obtener los usuarios"
		});
	}
}

/**@funcion para obtener a un usuario registrado por su id */
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("roles", "-__v");
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al obtener el usuario" });
	}
}

/**@funcion para actualizar a un usuario registrado */ 
export const updateUser = async (req, res) => {
	try {
		const { userId } = req.params;
	  	const { username, email, roles, imgURL } = req.body;
	  	const rolesIds = await Role.find({ name: { $in: roles } });
	  	const updatedData = { username, email, roles: rolesIds.map((role) => role._id), imgURL };
	  	const updatedUser = await User.findByIdAndUpdate(
			userId,
			updatedData,
			{ new: true, runValidators: true }
	  	).populate('roles');
	  	if (!updatedUser) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
	  	}
	  	const rolesAsString = updatedUser.roles.map((role) => role.name).join(', ');
		res.status(200).json({
			message: 'Usuario actualizado correctamente',
			user: {
		  	...updatedUser.toObject(), 
		  	roles: rolesAsString, 
			},
	  	});
	} catch (error) {
	  	console.error('Error al actualizar el usuario:', error);
	  	res.status(500).json({
			message: 'Error al actualizar el usuario', 
			error: error.message 
		});
	}
};

/**@funcion para eliminar a un usuario registrado */
export const deleteUser = async (req, res ) => {
	const { userId } = req.params;
	try {
		await User.findByIdAndDelete(userId);
		res.status(204).json({ 
			message: "Usuario eliminado correctamente" 
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ 
			message: "Error al eliminar el usuario" 
		});
	}
}
