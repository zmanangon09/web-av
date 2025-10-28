import React, { useEffect, useState } from 'react';
import { listarEmpleados, eliminarEmpleado } from '../services/empleadoService.js';
import EmpleadoDetalle from './EmpleadoDetalle.js';
import EmpleadoForm from './EmpleadoForm.js';
import ConfiguracionInicial from './ConfiguracionInicial.js';
import RegistroMultipleEmpleados from './RegistroMultipleEmpleados.js';

export default function EmpleadoLista() {
  const [empleados, setEmpleados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarRegistroMultiple, setMostrarRegistroMultiple] = useState(false);
  const [configuracion, setConfiguracion] = useState(null);

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
    // Asegurar que horasPorDia sea un array
    let horasPorDia = e.horasPorDia;
    
    // Si es string, intentar parsearlo
    if (typeof horasPorDia === 'string') {
      try {
        horasPorDia = JSON.parse(horasPorDia);
      } catch {
        horasPorDia = [0, 0, 0, 0, 0, 0, 0];
      }
    }
    
    // Si no es un array, usar array por defecto
    if (!Array.isArray(horasPorDia)) {
      horasPorDia = [0, 0, 0, 0, 0, 0, 0];
    }
    
    const horasTotales = horasPorDia.reduce((sum, h) => sum + (Number(h) || 0), 0);
    return horasTotales * (e.pagoPorHora || 0);
  }

  async function onEliminar(id) {
    if (!window.confirm('Eliminar empleado?')) return;
    try {
      await eliminarEmpleado(id);
      await cargar();
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar');
    }
  }

  const totalNomina = empleados.reduce((acc, e) => acc + calcularSueldo(e), 0);

  function handleIniciarConfiguracion(config) {
    setConfiguracion(config);
    setMostrarConfiguracion(false);
    setMostrarRegistroMultiple(true);
  }

  function handleCompletarRegistro() {
    setMostrarRegistroMultiple(false);
    setConfiguracion(null);
    cargar();
  }

  function handleCancelarTodo() {
    setMostrarConfiguracion(false);
    setMostrarRegistroMultiple(false);
    setConfiguracion(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Gestión de Empleados</h2>
      <button 
        onClick={() => { setMostrarConfiguracion(true); }}
        style={{ 
          padding: '12px 25px', 
          cursor: 'pointer', 
          marginBottom: 15,
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        👥 Nuevos Empleados
      </button>
      
      {mostrarConfiguracion && (
        <ConfiguracionInicial 
          onIniciar={handleIniciarConfiguracion}
          onCancelar={() => setMostrarConfiguracion(false)}
        />
      )}

      {mostrarRegistroMultiple && configuracion && (
        <RegistroMultipleEmpleados 
          numEmpleados={configuracion.numEmpleados}
          pagoPorHora={configuracion.pagoPorHora}
          onCompleto={handleCompletarRegistro}
          onCancelar={handleCancelarTodo}
        />
      )}
      
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
            // Asegurar que horasPorDia sea un array
            let horasPorDia = e.horasPorDia;
            if (typeof horasPorDia === 'string') {
              try {
                horasPorDia = JSON.parse(horasPorDia);
              } catch {
                horasPorDia = [0, 0, 0, 0, 0, 0, 0];
              }
            }
            if (!Array.isArray(horasPorDia)) {
              horasPorDia = [0, 0, 0, 0, 0, 0, 0];
            }
            
            const horasTotales = horasPorDia.reduce((sum, h) => sum + (Number(h) || 0), 0);
            
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