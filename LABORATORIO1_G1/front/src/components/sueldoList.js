import React, { useEffect, useState } from 'react';
import { listarEmpleados, eliminarEmpleado } from '../../services/sueldoService.js';
import SueldoDetalle from './sueldoDetalle.js';
import SueldoForm from './SueldoForm';

export default function SueldoList() {
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
    return (e.horasTrabajadas || 0) * (e.pagoPorHora || 0);
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
    <div>
      <h2>Empleados</h2>
      <button onClick={() => { setMostrarForm(true); setSeleccionado(null); }}>Nuevo empleado</button>
      {mostrarForm && <SueldoForm onGuardado={() => { setMostrarForm(false); cargar(); }} onCancelar={() => setMostrarForm(false)} empleado={seleccionado} />}
      <table border="1" cellPadding="6" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Horas</th>
            <th>Pago/hora</th>
            <th>Sueldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e.id}>
              <td>{e.nombreCompleto || e.nombre}</td>
              <td>{e.horasTrabajadas}</td>
              <td>{e.pagoPorHora}</td>
              <td>{calcularSueldo(e)}</td>
              <td>
                <button onClick={() => setSeleccionado(e.id)}>Ver</button>
                <button onClick={() => { setMostrarForm(true); setSeleccionado(e); }}>Editar</button>
                <button onClick={() => onEliminar(e.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total nómina: {totalNomina}</h3>

      {seleccionado && typeof seleccionado === 'number' && <SueldoDetalle id={seleccionado} onCerrar={() => setSeleccionado(null)} />}
    </div>
  );
}