import User from "../../models/User";
import Role from  "../../models/Role";

/**@funcion para crear un nuevo usuario */
export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles, imgURL } = req.body;
    const rolesFound = await Role.find({ name: { $in: roles } });
    const user = new User({
      username,
      email,
      password,
      imgURL,
      roles: rolesFound.map((role) => role._id ),
    });
    user.password = await User.encryptPassword(user.password);
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
    console.error("Ocurrio un error al crear el usuario " + error);
  }
};

/**@funcion para Otener a todos los usuarios */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.log("Ocurrio un error al obtener los usuarios " + error);
  }
};

/**@funcion para obtener a un usuario por id */ 
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.json(user);
  } catch (error) {
    console.log("Ocurrio un error al obtener el usuario " + error);
  }
};