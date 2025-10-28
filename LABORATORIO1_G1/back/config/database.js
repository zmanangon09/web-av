import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // 'sueldos'
  process.env.DB_USER,      // 'root'
  process.env.DB_PASSWORD,  // '' (vacio)
  {
    host: process.env.DB_HOST,    // 'localhost'
    port: process.env.DB_PORT,    // 3306
    dialect: 'mysql',
    logging: false,  // puedes cambiar a console.log para ver las queries SQL
     
  }
);

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexion a la base de datos exitosa');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

export default sequelize;