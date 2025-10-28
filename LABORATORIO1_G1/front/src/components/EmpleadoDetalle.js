import React, { useState, useEffect } from 'react';
import { calcularSueldo } from '../services/empleadoService.js';

function EmpleadoDetalle({ empleadoId }) {
  const [detalleSueldo, setDetalleSueldo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (empleadoId) {
      cargarDetalle();
    }
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
    return <div className="empleado-detalle"><p>Calculando sueldo...</p></div>;
  }

  if (!detalleSueldo || !detalleSueldo.empleado) {
    return <div className="empleado-detalle"><p>No se pudo cargar el empleado</p></div>;
  }

  return (
    <div className="empleado-detalle" style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
      <h3>👤 Detalle del Empleado #{detalleSueldo.empleado.id}</h3>
      
      <div className="info-general" style={{ marginBottom: '20px' }}>
        <p><strong>Nombre:</strong> {detalleSueldo.empleado.nombre}</p>
        <p><strong>Horas Totales:</strong> {detalleSueldo.horasTotales} hrs</p>
        <p><strong>Días Laborados:</strong> {detalleSueldo.diasTrabajados} días</p>
        <p><strong>Pago por Hora:</strong> ${detalleSueldo.pagoPorHora}</p>
        <p className="sueldo-total" style={{ color: '#27ae60', fontSize: '18px' }}>
          <strong>Sueldo Semanal:</strong> ${detalleSueldo.sueldoSemanal.toFixed(2)}
        </p>
      </div>

      <h4>📅 Desglose por Día de la Semana:</h4>
      <div className="horas-detalle" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
        gap: '10px' 
      }}>
        {detalleSueldo.desglosePorDia && detalleSueldo.desglosePorDia.map((dia, index) => (
          <div 
            key={index} 
            className={`dia-detalle ${dia.horas > 0 ? 'activo' : 'inactivo'}`}
            style={{
              padding: '10px',
              border: dia.horas > 0 ? '2px solid #27ae60' : '1px solid #ccc',
              borderRadius: '5px',
              textAlign: 'center',
              backgroundColor: dia.horas > 0 ? '#e8f8f5' : '#f5f5f5'
            }}
          >
            <strong style={{ display: 'block', marginBottom: '5px' }}>{dia.dia}</strong>
            <p style={{ margin: '3px 0' }}>{dia.horas} hrs</p>
            <p style={{ margin: '3px 0', color: dia.horas > 0 ? '#27ae60' : '#999' }}>
              ${dia.pago.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmpleadoDetalle;