import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const dbConnection = async () => {
	try {
		mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Conexión con la base de datos establecida exitosamente");

	} catch (error) {
		console.error("Error en la conexión con la base de datos:", error);
		throw error; // Opcional: lanza el error para manejo adicional
	}
};

export default dbConnection;
