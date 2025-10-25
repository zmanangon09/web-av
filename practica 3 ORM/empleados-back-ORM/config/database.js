//configurar el equelize para conectar con mysql
//deber con postgresql
//importar librerias
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//cargar las variables de entorno
dotenv.config();

//crear la conexion a la base de datos-utilizando las variables de entorno del .env

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
    }

);
//estoy exportando la conexion para usar desde otros archivos
export default sequelize;
