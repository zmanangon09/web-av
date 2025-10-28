import React, { useState, useEffect } from 'react';
import { calcularSueldo } from '../services/empleadoService.js';

function EmpleadoDetalle({ empleadoId }) {
  const [detalleSueldo, setDetalleSueldo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDetalle();
  }, [empleadoId]);

  const cargarDetalle = async () => {
    try {
      setCargando(true);
      const data = await calcularSueldo(empleadoId);
      setDetalleSueldo(data);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      alert('Error al cargar los detalles del empleado');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div className="empleado-detalle"><p>Calculando sueldo...</p></div>;
  }

  if (!detalleSueldo) {
    return <div className="empleado-detalle"><p>No se pudo cargar el empleado</p></div>;
  }

  return (
    <div className="empleado-detalle">
      <h3>👤 Detalle del Empleado #{detalleSueldo.empleado.id}</h3>
      
      <div className="info-general">
        <p><strong>Nombre:</strong> {detalleSueldo.empleado.nombre}</p>
        <p><strong>Horas Totales:</strong> {detalleSueldo.horasTotales} hrs</p>
        <p><strong>Días Laborados:</strong> {detalleSueldo.diasTrabajados} días</p>
        <p><strong>Pago por Hora:</strong> ${detalleSueldo.pagoPorHora}</p>
        <p className="sueldo-total"><strong>Sueldo Semanal:</strong> ${detalleSueldo.sueldoSemanal.toFixed(2)}</p>
      </div>

      <h4>📅 Desglose por Día de la Semana:</h4>
      <div className="horas-detalle">
        {detalleSueldo.desglosePorDia.map((dia, index) => (
          <div key={index} className={`dia-detalle ${dia.horas > 0 ? 'activo' : 'inactivo'}`}>
            <strong>{dia.dia}</strong>
            <p>{dia.horas} hrs</p>
            <p>${dia.pago.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmpleadoDetalle;