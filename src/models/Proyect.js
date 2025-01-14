import mongoose from "mongoose";
const Schema = mongoose.Schema


const proyectSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String,  },
		category: { type: String, required: true },
		imgURL: { type: String, required: true}, // Agregar el campo imgURL
		state: { type: String, required: true },
	},
	{
	timestamps: true,
	verrsionKey: false	
})
export default mongoose.model('Proyect', proyectSchema);

