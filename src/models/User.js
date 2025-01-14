import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
// import Role from './Role.js';

const userSchema = new Schema({
    username: { type: String, required: true }, // Usa "username" en lugar de "usename"
    email: { type: String, required: true, unique: true },
    password: { type: String },
    roles: [{ ref: "Role", type: Schema.Types.ObjectId }],
    imgURL: { type: String}, // Agregar el campo imgURL
}, { timestamps: true, versionKey: false });


//cifrar la constraseña
userSchema.statics.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(10) //creamos uns sal aleatorio de 10 rondas
	return await bcrypt.hash(password, salt) //devuelve un hash de la contraseña cifrada
}
//comparar la contraseña
userSchema.statics.comparePassword = async (password, receivedPassword) => {
	return await bcrypt.compare(password, receivedPassword) //devuelve true si las contraseñas son iguales
}

export default model('User', userSchema);