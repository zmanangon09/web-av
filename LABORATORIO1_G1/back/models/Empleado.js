import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Empleado extends Model {
  // Método para calcular el sueldo semanal
  calcularSueldo() {
    const horasTotales = this.horasPorDia.reduce((sum, h) => sum + h, 0);
    const diasTrabajados = this.horasPorDia.filter(h => h > 0).length;
    const sueldoSemanal = horasTotales * this.pagoPorHora;

    // Desglose por día
    const desglosePorDia = this.horasPorDia.map((horas, index) => ({
      dia: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index],
      horas: horas,
      pago: horas * this.pagoPorHora
    }));

    return {
      horasTotales,
      diasTrabajados,
      pagoPorHora: this.pagoPorHora,
      sueldoSemanal,
      desglosePorDia
    };
  }

  // Método para actualizar horas de un día específico
  actualizarHorasDia(diaSemana, horas) {
    const diasMap = {
      'lunes': 0, 'martes': 1, 'miercoles': 2, 'jueves': 3,
      'viernes': 4, 'sabado': 5, 'domingo': 6
    };
    
    const index = diasMap[diaSemana.toLowerCase()];
    if (index !== undefined) {
      const nuevasHoras = [...this.horasPorDia];
      nuevasHoras[index] = horas;
      this.horasPorDia = nuevasHoras;
    }
  }
}

// Definir el modelo Empleado (estructura de la tabla)
Empleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    // Array con las horas de cada día [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
    horasPorDia: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [0, 0, 0, 0, 0, 0, 0]
    },
    pagoPorHora: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Empleado', 
    timestamps: true,
    tableName: 'empleados' // Nombre de la tabla en la base de datos
  }
);

export default Empleado;