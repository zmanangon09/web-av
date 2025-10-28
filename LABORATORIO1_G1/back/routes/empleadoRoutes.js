import express from 'express';
import EmpleadoController from '../controllers/empleadoController.js';

const router = express.Router();

router.post('/empleados', EmpleadoController.crear);
router.get('/empleados', EmpleadoController.obtenerTodos);
router.get('/empleados/resumen', EmpleadoController.obtenerResumen);
router.get('/empleados/:id', EmpleadoController.obtenerPorId);
router.get('/empleados/:id/sueldo', EmpleadoController.calcularSueldo);
router.put('/empleados/:id', EmpleadoController.actualizar);
router.delete('/empleados/:id', EmpleadoController.eliminar);

export default router;