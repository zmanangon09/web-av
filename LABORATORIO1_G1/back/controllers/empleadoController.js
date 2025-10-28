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
      
      // Validar que horasPorDia sea un array
      let horasArray = horasPorDia;
      if (typeof horasPorDia === 'string') {
        try {
          horasArray = JSON.parse(horasPorDia);
        } catch {
          return res.status(400).json({ 
            error: 'horasPorDia debe ser un array válido' 
          });
        }
      }
      
      if (!Array.isArray(horasArray) || horasArray.length !== 7) {
        return res.status(400).json({ 
          error: 'horasPorDia debe ser un array de 7 elementos' 
        });
      }

      const empleado = await Empleado.create({
        nombre: nombre.trim(),
        horasPorDia: horasArray.map(h => Number(h) || 0),
        pagoPorHora: Number(pagoPorHora)
      });
      
      res.status(201).json(empleado.toJSON());
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ error: error.message || 'Error al crear empleado' });
    }
  },

  // Obtener todos
  obtenerTodos: async (req, res) => {
    try {
      const empleados = await Empleado.findAll({
        order: [['id', 'ASC']]
      });
      
      // Asegurar que los datos se serialicen correctamente
      const empleadosJSON = empleados.map(emp => emp.toJSON());
      
      res.json(empleadosJSON);
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
      
      res.json(empleado.toJSON());
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

      // Validar horasPorDia si se proporciona
      if (horasPorDia !== undefined) {
        let horasArray = horasPorDia;
        if (typeof horasPorDia === 'string') {
          try {
            horasArray = JSON.parse(horasPorDia);
          } catch {
            return res.status(400).json({ 
              error: 'horasPorDia debe ser un array válido' 
            });
          }
        }
        
        if (!Array.isArray(horasArray) || horasArray.length !== 7) {
          return res.status(400).json({ 
            error: 'horasPorDia debe ser un array de 7 elementos' 
          });
        }
      }

      // Preparar datos de actualización
      const datosActualizacion = {};
      if (nombre !== undefined) datosActualizacion.nombre = nombre.trim();
      if (horasPorDia !== undefined) {
        const horasArray = typeof horasPorDia === 'string' ? JSON.parse(horasPorDia) : horasPorDia;
        datosActualizacion.horasPorDia = horasArray.map(h => Number(h) || 0);
      }
      if (pagoPorHora !== undefined) datosActualizacion.pagoPorHora = Number(pagoPorHora);

      await empleado.update(datosActualizacion);
      
      res.json(empleado.toJSON());
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ error: error.message || 'Error al actualizar empleado' });
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