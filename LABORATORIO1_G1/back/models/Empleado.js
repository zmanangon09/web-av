import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Empleado extends Model {
  // Getter para asegurar que horasPorDia siempre sea un array
  get horasPorDia() {
    const rawValue = this.getDataValue('horasPorDia');
    // Si es string, parsearlo; si es array, devolverlo; sino, array por defecto
    if (typeof rawValue === 'string') {
      try {
        return JSON.parse(rawValue);
      } catch {
        return [0, 0, 0, 0, 0, 0, 0];
      }
    }
    return Array.isArray(rawValue) ? rawValue : [0, 0, 0, 0, 0, 0, 0];
  }

  // Setter para horasPorDia
  set horasPorDia(value) {
    this.setDataValue('horasPorDia', value);
  }

  // Método para calcular el sueldo semanal
  calcularSueldo() {
    const horas = this.horasPorDia; // Usar el getter
    const horasTotales = horas.reduce((sum, h) => sum + h, 0);
    const diasTrabajados = horas.filter(h => h > 0).length;
    const sueldoSemanal = horasTotales * this.pagoPorHora;

    // Desglose por día
    const desglosePorDia = horas.map((horasDia, index) => ({
      dia: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index],
      horas: horasDia,
      pago: horasDia * this.pagoPorHora
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
      const horasActuales = this.horasPorDia; // Usar el getter
      const nuevasHoras = [...horasActuales];
      nuevasHoras[index] = horas;
      this.horasPorDia = nuevasHoras;
    }
  }

  // Método toJSON personalizado para serializar correctamente
  toJSON() {
    const values = Object.assign({}, this.get());
    // Asegurar que horasPorDia sea un array en la respuesta JSON
    if (values.horasPorDia) {
      values.horasPorDia = this.horasPorDia; // Usar el getter
    }
    return values;
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
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        }
      }
    },
    // Array con las horas de cada día [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
    horasPorDia: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [0, 0, 0, 0, 0, 0, 0],
      validate: {
        isValidArray(value) {
          let arr = value;
          if (typeof value === 'string') {
            try {
              arr = JSON.parse(value);
            } catch {
              throw new Error('horasPorDia debe ser un array JSON válido');
            }
          }
          if (!Array.isArray(arr)) {
            throw new Error('horasPorDia debe ser un array');
          }
          if (arr.length !== 7) {
            throw new Error('horasPorDia debe tener exactamente 7 elementos');
          }
        }
      }
    },
    pagoPorHora: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'El pago por hora debe ser mayor a 0'
        }
      }
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