import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import empleadoRoutes from './routes/empleadoRoutes.js';

dotenv.config();  // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', empleadoRoutes);

sequelize.sync({ alter: true })  // usar { force: true } para recrear tablas desde cero
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar base de datos:', err);
  });

export default app;