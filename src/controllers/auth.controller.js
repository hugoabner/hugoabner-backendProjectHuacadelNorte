import User from '../models/User';
import JWT from 'jsonwebtoken';
import Role from '../models/Role';
import CryptoJS from 'crypto-js';

//funcion para Iniciar Sesion 
export const signIn = async (req, res) => {
	const userFound =  await User.findOne({email: req.body.email}).populate("roles");
	if (!userFound){
		return res.status(400).json({
		message: "El usuario no existe"});
		}

	//comparamos el password de la db con el password del usuario que se quiere loguear
	const matchPassword = await User.comparePassword(req.body.password, userFound.password);
	if (!matchPassword){
		return res.status(401).json({
		token: null, 
		message: "La contraseña es incorrecta"});
		}	

		//convertimos a string el array de roles y extraemos el name de cada rol
		const rolesAsString = Array.isArray(userFound.roles)
		? userFound.roles.map((role) => role.name).join(', ') // Si es un array de roles
		: userFound.roles.name; // Si es un único objeto de rol
		  
		const token = JWT.sign({id: userFound._id}, process.env.JWT_SECRET_KEY, {
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
	console.log(userFound);
}

//funcion para decifrar el email y la contraseña
// const decryptData = (encryptedData, secretKey) => {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
//     return bytes.toString(CryptoJS.enc.Utf8);
// };

// export const signIn = async (req, res) => {
//     try {
//         const secretKey = "your-secret-key"; // Debe coincidir con la clave usada en el frontend para cifrar

//         // Descifrar el email y la contraseña
//         const email = decryptData(req.body.email, secretKey);
//         const password = decryptData(req.body.password, secretKey);

//         // Buscar el usuario por email y popular roles
//         const userFound = await User.findOne({ email }).populate("roles");
//         if (!userFound) {
//             return res.status(400).json({
//                 message: "El usuario no existe"
//             });
//         }

//         // Comparar contraseñas (en el caso de que uses hashing para contraseñas, por ejemplo con bcrypt)
//         const matchPassword = await User.comparePassword(password, userFound.password);
//         if (!matchPassword) {
//             return res.status(401).json({
//                 token: null,
//                 message: "La contraseña es incorrecta"
//             });
//         }

//         // Crear el payload del token
//         const payload = {
//             id: userFound._id,
//             username: userFound.username,
//             email: userFound.email,
//             roles: userFound.roles.map(role => role.name) // Asegúrate de mapear los roles a nombres si es necesario
//         };

//         // Generar el token con toda la información
//         const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, {
//             expiresIn: 86400 // 24 horas
//         });

//         // Responder con el token
//         res.json({ token });
//         console.log(userFound);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error en el servidor" });
//     }
// };


//funcion para obtener el perfil de un usuario cuando esta logueado
export const getProfile = async (req, res) => {
	const userProfile = await User.findOne({
		_id: req.userId,
	}).populate("roles", "-__v");

	res.status(200).json({
		id: userProfile._id,
		username: userProfile.username,
		email: userProfile.email,
		roles: userProfile.roles
	})  
}	

//funcion para Registrar a un usuario 
export const signUp = async (req, res) => {
	const { username, email, password, roles, imgURL } = req.body;
  
	// Crear un nuevo usuario con los datos básicos
	const newUser = new User({
	  username,
	  email,
	  password: await User.encryptPassword(password),
	  imgURL,
	});
  
	if (roles && roles.length > 0) {
	  // Extraer los nombres de los roles si roles es un array de objetos
	  const roleNames = roles.map((role) => (typeof role === "string" ? role : role.name));
  
	  // Buscar roles en la base de datos
	  const foundRoles = await Role.find({ name: { $in: roleNames } });
	  
	  // Mapear los _id de los roles encontrados
	  newUser.roles = foundRoles.map((role) => role._id);
	} else {
	  // Asignar rol por defecto
	  const roleDefault = await Role.findOne({ name: "user" });
	  newUser.roles = [roleDefault._id];
	}
  
	// Guardar el usuario en la base de datos
	const savedUser = await newUser.save();
  
	// Crear un token de autenticación
	const token = JWT.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, {
	  expiresIn: 86400, // 24 horas
	});
  
	// Responder con el usuario guardado y el token
	res.status(200).json({ user: savedUser });
	console.log(savedUser);
};
  
//funcion para obtener a todos los usuarios registrados
export const getUsers = async (req, res) => {
	try {
		
		const users = await User.find().populate("roles", "-__v");
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al obtener los usuarios" });
	}
}

//funcion para obtener a un usuario registrado por su id
export const getUserById = async (req, res) => {
	try {
		
		const user = await User.findById(req.params.id).populate("roles", "-__v");
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al obtener el usuario" });
	}
}
//funcion para actualizar a un usuario registrado
export const updateUser = async (req, res) => {
	try {
	  const { userId } = req.params;
	  const { username, email, roles, imgURL } = req.body;
  
	  // Buscar los roles por su nombre en la base de datos
	  const rolesIds = await Role.find({ name: { $in: roles } });
  
	  // Preparar los datos para la actualización excluyendo la contraseña
	  const updatedData = { username, email, roles: rolesIds.map((role) => role._id), imgURL };
  
	  // Actualizar el usuario con los datos proporcionados
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		updatedData,
		{ new: true, runValidators: true }
	  ).populate('roles'); // Poblar la información de los roles
  
	  if (!updatedUser) {
		return res.status(404).json({ message: 'Usuario no encontrado' });
	  }
  
	  // Extraer los nombres de los roles del usuario actualizado
	  const rolesAsString = updatedUser.roles.map((role) => role.name).join(', ');
  
	  res.status(200).json({
		message: 'Usuario actualizado correctamente',
		user: {
		  ...updatedUser.toObject(), // Convertir el documento a un objeto plano
		  roles: rolesAsString, // Incluir los nombres de los roles como string
		},
	  });
	} catch (error) {
	  console.error('Error al actualizar el usuario:', error);
	  res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
	}
  };
  
  
// try {
// 	const { userId } = req.params;
// 	const { username, email, password, roles, imgURL } = req.body;
// 	const updatedUser = await User.findByIdAndUpdate(userId, {
// 		username,
// 		email,
// 		password,
// 		roles,
// 		imgURL
// 	}, { new: true });
// 	res.status(200).json(updatedUser);
	
// } catch (error) {
// 	console.error(error);
// 	res.status(500).json({ message: "Error al actualizar el usuario" });
// }

//funcion para eliminar a un usuario registrado
export const deleteUser = async (req, res ) => {
	const { userId } = req.params;
	try {
		await User.findByIdAndDelete(userId);
		res.status(204).json({ message: "Usuario eliminado correctamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al eliminar el usuario" });
	}
}
