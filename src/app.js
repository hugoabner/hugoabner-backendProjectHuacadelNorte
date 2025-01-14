import express from 'express';
import morgan from 'morgan';
import cors from 'cors'; // Importa cors
import pkg from '../package.json';
import proyectRoutes from './routes/proyects.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import { createRoles } from './libs/initialsSetup';

const app = express();
createRoles();

app.set('pkg', pkg);

// Middlewares
app.use(cors({
origin: '*', // Asegúrate de que coincide con tu frontend

credentials: true,

}));

app.use(morgan('dev'));
app.use(express.json());

// Ruta inicial para información del servidor
app.get('/', (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
  });
});

// Rutas
app.use('/proyect', proyectRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

export default app;
