import React, { useEffect, useState } from 'react';
import { listarEmpleados, eliminarEmpleado } from '../services/empleadoService.js';
import EmpleadoDetalle from './EmpleadoDetalle.js';
import EmpleadoForm from './EmpleadoForm.js';

export default function EmpleadoLista() {
  const [empleados, setEmpleados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  async function cargar() {
    try {
      const data = await listarEmpleados();
      setEmpleados(data);
    } catch (e) {
      console.error(e);
      alert('Error cargando empleados');
    }
  }

  useEffect(() => { cargar(); }, []);

  function calcularSueldo(e) {
    const horasTotales = e.horasPorDia ? e.horasPorDia.reduce((sum, h) => sum + h, 0) : 0;
    return horasTotales * (e.pagoPorHora || 0);
  }

  async function onEliminar(id) {
    if (!confirm('Eliminar empleado?')) return;
    try {
      await eliminarEmpleado(id);
      await cargar();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar');
    }
  }

  const totalNomina = empleados.reduce((acc, e) => acc + calcularSueldo(e), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Gestión de Empleados</h2>
      <button 
        onClick={() => { setMostrarForm(true); setSeleccionado(null); }}
        style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: 15 }}
      >
        ➕ Nuevo Empleado
      </button>
      
      {mostrarForm && (
        <EmpleadoForm 
          onGuardado={() => { setMostrarForm(false); cargar(); }} 
          onCancelar={() => setMostrarForm(false)} 
          empleado={seleccionado} 
        />
      )}
      
      <table border="1" cellPadding="8" style={{ marginTop: 15, width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Horas Totales</th>
            <th>Pago/hora</th>
            <th>Sueldo Semanal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => {
            const horasTotales = e.horasPorDia ? e.horasPorDia.reduce((sum, h) => sum + h, 0) : 0;
            return (
              <tr key={e.id}>
                <td style={{ textAlign: 'center' }}>{e.id}</td>
                <td>{e.nombre}</td>
                <td style={{ textAlign: 'center' }}>{horasTotales} hrs</td>
                <td style={{ textAlign: 'center' }}>${e.pagoPorHora}</td>
                <td style={{ textAlign: 'center' }}>${calcularSueldo(e).toFixed(2)}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => setSeleccionado(e.id)} style={{ marginRight: 5 }}>👁️ Ver</button>
                  <button onClick={() => { setMostrarForm(true); setSeleccionado(e); }} style={{ marginRight: 5 }}>✏️ Editar</button>
                  <button onClick={() => onEliminar(e.id)} style={{ background: '#ff4444', color: 'white' }}>🗑️ Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <h3 style={{ marginTop: 20, color: '#2c3e50' }}>
        💰 Total Nómina Semanal: ${totalNomina.toFixed(2)}
      </h3>

      {seleccionado && typeof seleccionado === 'number' && (
        <div style={{ marginTop: 20, padding: 15, border: '2px solid #3498db', borderRadius: 8 }}>
          <EmpleadoDetalle empleadoId={seleccionado} />
          <button onClick={() => setSeleccionado(null)} style={{ marginTop: 10, padding: '8px 20px' }}>
            ✖️ Cerrar Detalle
          </button>
        </div>
      )}
    </div>
  );
}