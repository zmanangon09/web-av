import { DataTypes } from "sequelize";
import {Model} from "sequelize";
import sequelize from "../config/database.js";  

class Obrero extends Model {
    //metodo calcular salario del obrero
    calcularSalario() {
        const hora = this.horasTrabajadas;

        //si trabaja 40 horas o menos son 20 dolares la hora 
        //si pasa de las 40 horas son 25 dolares las horas extra y 20 dolares las primeras 40 horas
        const horasNormales = Math.min(hora, 40);   
        //si pasa de 40 horas, se cuenta como extras
        const horasExtras = Math.max(hora - 40, 0);

        //calculos
        const pagoNormal =horasNormales * 20;
        const pagoExtra = horasExtras * 25;
        
        const total = pagoNormal + pagoExtra;
        return {total, horasExtras, pagoExtra, horasNormales, pagoNormal};
    }


}

//NECESITO DEFINIR EL MODELO OBRERO (ESTRUCTURA DE LA TABLA )

Obrero.init(
    {
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
    nombreCompleto:{type: DataTypes.STRING(80), allowNull:false},
    horasTrabajadas:{type: DataTypes.INTEGER, allowNull:false},



    }, 
    {
        //este sequelize es la conexion a la base de datos
        sequelize,
        modelName: "Obrero", //nombre del modelo
        timestamps: true, //para ver cuando se creo y cuando se actualizo

    }
);

export default Obrero;