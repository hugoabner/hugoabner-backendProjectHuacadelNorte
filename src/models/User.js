import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    role: {
        type: {
            _id: { type: Schema.Types.ObjectId, ref: 'Role' },
            name: { type: String }
        }, required: true
    },
    imgURL:     { type: String},
}, {timestamps: true, 
    versionKey: false 
});


/**@funcion para cifrar la contraseña*/
userSchema.statics.encryptPassword = async (password) => {
    //creamos uns sal aleatorio de 10 rondas
	const salt = await bcrypt.genSalt(10) 
    //devuelve un hash de la contraseña cifrada
	return await bcrypt.hash(password, salt) 
}


/**@funcion para comparar la contraseña */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    //devuelve true si las contraseñas son iguales
	return await bcrypt.compare(password, receivedPassword) 
}

export default model('User', userSchema);