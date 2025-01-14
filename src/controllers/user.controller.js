import User from "../models/User";
import Role from  "../models/Role";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles, imgURL } = req.body;

    const rolesFound = await Role.find({ name: { $in: roles } });
    // crear el nuevo usuario
    const user = new User({
      username,
      email,
      password,
      imgURL,
      roles: rolesFound.map((role) => role._id ),
    });
    //  ciframos la contraseña
    user.password = await User.encryptPassword(user.password);
    // Guardamos al nuevo usario
    const savedUser = await user.save();
    console.log(savedUser);

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      password: savedUser.password ,
      roles: savedUser.roles,
      imgURL: savedUser.imgURL
    });
  } catch (error) {
    console.error(error);
  }
};

//funcion para Otener a todos los usuarios
export const getUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

//funcion para obtener a un usuario por id
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};