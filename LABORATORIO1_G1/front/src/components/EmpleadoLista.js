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
    let horasPorDia = e.horasPorDia;
    if (typeof horasPorDia === 'string') {
      try { horasPorDia = JSON.parse(horasPorDia); } catch { horasPorDia = [0,0,0,0,0,0,0]; }
    }
    if (!Array.isArray(horasPorDia)) horasPorDia = [0,0,0,0,0,0,0];
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
    <div align="center">
      <fieldset>
        <legend>Gestión de Empleados</legend>

        <div>
          <button onClick={() => { setMostrarConfiguracion(true); }}>Nuevos Empleados</button>
        </div>
        <br />

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

        <br />
        <table border="1" cellPadding="6">
          <thead>
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
              let horasPorDia = e.horasPorDia;
              if (typeof horasPorDia === 'string') {
                try { horasPorDia = JSON.parse(horasPorDia); } catch { horasPorDia = [0,0,0,0,0,0,0]; }
              }
              if (!Array.isArray(horasPorDia)) horasPorDia = [0,0,0,0,0,0,0];
              const horasTotales = horasPorDia.reduce((sum, h) => sum + (Number(h) || 0), 0);

              return (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>{horasTotales} hrs</td>
                  <td>${e.pagoPorHora}</td>
                  <td>${calcularSueldo(e).toFixed(2)}</td>
                  <td>
                    <button onClick={() => setSeleccionado(e.id)}>Ver</button>
                    <button onClick={() => { setMostrarForm(true); setSeleccionado(e); }}>Editar</button>
                    <button onClick={() => onEliminar(e.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <br />
        <div>
          <strong>Total Nómina Semanal:</strong> ${totalNomina.toFixed(2)}
        </div>

        {seleccionado && typeof seleccionado === 'number' && (
          <div>
            <EmpleadoDetalle empleadoId={seleccionado} />
            <br />
            <button onClick={() => setSeleccionado(null)}>Cerrar Detalle</button>
          </div>
        )}
      </fieldset>
    </div>
  );
}