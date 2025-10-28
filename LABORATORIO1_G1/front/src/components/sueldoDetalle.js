import React, { useEffect, useState } from 'react';
import { obtenerEmpleado } from '../../services/sueldoService';

export default function SueldoDetalle({ id, onCerrar }) {
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerEmpleado(id);
        setEmpleado(data);
      } catch (e) {
        console.error(e);
        alert('No se pudo cargar detalle');
      }
    }
    if (id) cargar();
  }, [id]);

  if (!empleado) return <div>Cargando detalle...</div>;

  const sueldo = (empleado.horasTrabajadas || 0) * (empleado.pagoPorHora || 0);

  return (
    <div style={{ border: '1px solid #ccc', padding: 8, marginTop: 12 }}>
      <h3>Detalle</h3>
      <p><strong>Nombre:</strong> {empleado.nombreCompleto || empleado.nombre}</p>
      <p><strong>Horas trabajadas:</strong> {empleado.horasTrabajadas}</p>
      <p><strong>Pago por hora:</strong> {empleado.pagoPorHora}</p>
      <p><strong>Sueldo:</strong> {sueldo}</p>
      <button onClick={onCerrar}>Cerrar</button>
    </div>
  );
}