import Empleado from '../models/Empleado.js';

const EmpleadoController = {
  // Crear nuevo empleado
  crear: async (req, res) => {
    try {
      const { nombre, horasPorDia, pagoPorHora } = req.body;
      
      if (!nombre || !horasPorDia || !pagoPorHora) {
        return res.status(400).json({ 
          error: 'Faltan datos requeridos (nombre, horasPorDia, pagoPorHora)' 
        });
      }
      
      if (!Array.isArray(horasPorDia) || horasPorDia.length !== 7) {
        return res.status(400).json({ 
          error: 'horasPorDia debe ser un array de 7 elementos' 
        });
      }

      const empleado = await Empleado.create({
        nombre,
        horasPorDia,
        pagoPorHora
      });
      
      res.status(201).json(empleado);
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ error: 'Error al crear empleado' });
    }
  },

  // Obtener todos
  obtenerTodos: async (req, res) => {
    try {
      const empleados = await Empleado.findAll({
        order: [['id', 'ASC']]
      });
      res.json(empleados);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ error: 'Error al obtener empleados' });
    }
  },

  // Obtener por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByPk(id);
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      
      res.json(empleado);
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      res.status(500).json({ error: 'Error al obtener empleado' });
    }
  },

  // Calcular sueldo de un empleado (usando el método del modelo)
  calcularSueldo: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByPk(id);
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      
      // Usar el método calcularSueldo() del modelo
      const detallesSueldo = empleado.calcularSueldo();
      
      res.json({
        empleado: {
          id: empleado.id,
          nombre: empleado.nombre
        },
        ...detallesSueldo
      });
    } catch (error) {
      console.error('Error al calcular sueldo:', error);
      res.status(500).json({ error: 'Error al calcular sueldo' });
    }
  },

  // Actualizar
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, horasPorDia, pagoPorHora } = req.body;
      
      const empleado = await Empleado.findByPk(id);
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }

      if (horasPorDia && (!Array.isArray(horasPorDia) || horasPorDia.length !== 7)) {
        return res.status(400).json({ 
          error: 'horasPorDia debe ser un array de 7 elementos' 
        });
      }

      await empleado.update({
        ...(nombre && { nombre }),
        ...(horasPorDia && { horasPorDia }),
        ...(pagoPorHora && { pagoPorHora })
      });
      
      res.json(empleado);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ error: 'Error al actualizar empleado' });
    }
  },

  // Eliminar
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await Empleado.findByPk(id);
      
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      
      await empleado.destroy();
      res.json({ mensaje: 'Empleado eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({ error: 'Error al eliminar empleado' });
    }
  },

  // Obtener resumen general
  obtenerResumen: async (req, res) => {
    try {
      const empleados = await Empleado.findAll();
      
      let sumaHorasSemanales = 0;
      let totalPagado = 0;
      
      // Usar el método calcularSueldo() de cada empleado
      empleados.forEach(empleado => {
        const sueldo = empleado.calcularSueldo();
        sumaHorasSemanales += sueldo.horasTotales;
        totalPagado += sueldo.sueldoSemanal;
      });
      
      const resumen = {
        totalEmpleados: empleados.length,
        sumaHorasSemanales,
        totalPagado: totalPagado.toFixed(2)
      };
      
      res.json(resumen);
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      res.status(500).json({ error: 'Error al obtener resumen' });
    }
  }
};

export default EmpleadoController;