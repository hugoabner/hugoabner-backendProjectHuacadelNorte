import User from '../../models/User';
import JWT from 'jsonwebtoken';
import Role from '../../models/Role';
import CryptoJS from 'crypto-js';

/**@funcion para Iniciar Sesion*/
export const signIn = async (req, res) => {
	try {
		const userFound =  await User.findOne({
			email: req.body.email
		})
		if (!userFound){
			throw new Error("El correo electronico no existe");
		}
		const matchPassword = await User.comparePassword(
			req.body.password, userFound.password
		);
		console.log(matchPassword);
		if (!matchPassword){
			throw new Error("La contraseña es incorrecta");
		}
		const token = JWT.sign({id: userFound._id}, 
		process.env.JWT_SECRET_KEY, {
		expiresIn: 86400 // el token expirara 24 horas
		})
		res.json({
			status: 'success',
			statusCode: 200,
			message: 'Su sesión se ha iniciado correctamente',
			user:{
				username: userFound.username,
				email: userFound.email,
				roles: userFound.role
			},
			token,
		});
	} catch (error) {
		console.log("Ocurrio un error al iniciar sesion " + error);
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: error.message
		});
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
		const { username, email, password, role, imgURL } = req.body.user;
		const newUser = new User({
			username, 
			email,
			role, 
			password: await User.encryptPassword(password),
			imgURL,
		});
		if (role) {
		const foundRoles = await Role.find({
			name: { $in: role }, 
		});
		newUser.role = {
			_id: foundRoles[0]._id,
			name: foundRoles[0].name
		};
		} else {
			throw new Error("El rol es requerido");
		}
		const savedUser = await newUser.save();
		res.status(200).json({ user: savedUser });
	} catch (error) {
		console.error("Ocurrio un error al registrar el usuario " + error);
		res.status(500).json({
			success: false,
			statusCode: 500,
			message: error.message
		})	
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
