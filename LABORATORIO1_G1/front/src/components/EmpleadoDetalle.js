import React, { useState, useEffect } from 'react';
import { calcularSueldo } from '../services/empleadoService.js';

function EmpleadoDetalle({ empleadoId }) {
  const [detalleSueldo, setDetalleSueldo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (empleadoId) {
      cargarDetalle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoId]);

  const cargarDetalle = async () => {
    try {
      setCargando(true);
      const data = await calcularSueldo(empleadoId);
      setDetalleSueldo(data);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      alert('Error al cargar los detalles del empleado');
      setDetalleSueldo(null);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div align="center"><p>Calculando sueldo...</p></div>;
  }

  if (!detalleSueldo || !detalleSueldo.empleado) {
    return <div align="center"><p>No se pudo cargar el empleado</p></div>;
  }

  return (
    <div align="center">
      <fieldset>
        <legend>Detalle del Empleado #{detalleSueldo.empleado.id}</legend>

        <div>
          <p><strong>Nombre:</strong> {detalleSueldo.empleado.nombre}</p>
          <p><strong>Horas Totales:</strong> {detalleSueldo.horasTotales} hrs</p>
          <p><strong>Días Laborados:</strong> {detalleSueldo.diasTrabajados} días</p>
          <p><strong>Pago por Hora:</strong> ${detalleSueldo.pagoPorHora}</p>
          <p><strong>Sueldo Semanal:</strong> ${detalleSueldo.sueldoSemanal.toFixed(2)}</p>
        </div>

        <h4>Desglose por Día de la Semana:</h4>
        <div>
          {detalleSueldo.desglosePorDia && detalleSueldo.desglosePorDia.map((dia, index) => (
            <div key={index}>
              <strong>{dia.dia}</strong>
              <p>{dia.horas} hrs</p>
              <p>${dia.pago.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default EmpleadoDetalle;