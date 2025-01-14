import app from './app';
import dbConnection from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 5000;

// Iniciar la conexión a la base de datos
dbConnection();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});
