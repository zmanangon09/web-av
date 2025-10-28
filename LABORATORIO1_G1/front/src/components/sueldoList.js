import React, { useState, useEffect } from 'react';
import { obtenerEmpleados, eliminarEmpleado } from '../services/empleadoService.js';
import EmpleadoDetalle from './EmpleadoDetalle.js';
import EmpleadoForm from './EmpleadoForm.js';

function EmpleadoLista() {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vistaDetalle, setVistaDetalle] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      alert('Error al cargar la lista de empleados');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;
    
    try {
      await eliminarEmpleado(id);
      alert('Empleado eliminado exitosamente');
      cargarEmpleados();
      
      if (empleadoSeleccionadoId === id) {
        setEmpleadoSeleccionadoId(null);
        setVistaDetalle(false);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar empleado');
    }
  };

  const handleVer = (id) => {
    setEmpleadoSeleccionadoId(id);
    setVistaDetalle(true);
    setMostrarFormulario(false);
  };

  const handleNuevo = () => {
    setModoEdicion(false);
    setEmpleadoSeleccionadoId(null);
    setVistaDetalle(false);
    setMostrarFormulario(true);
  };

  const handleEditar = (id) => {
    setModoEdicion(true);
    setEmpleadoSeleccionadoId(id);
    setVistaDetalle(false);
    setMostrarFormulario(true);
  };

  const handleFormSubmit = async () => {
    setMostrarFormulario(false);
    setVistaDetalle(false);
    setEmpleadoSeleccionadoId(null);
    await cargarEmpleados();
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEmpleadoSeleccionadoId(null);
  };

  // Calcular sueldo usando el método del modelo (simulado en frontend)
  const calcularSueldoLocal = (empleado) => {
    let horas = empleado.horasPorDia;
    if (typeof horas === 'string') {
      try {
        horas = JSON.parse(horas);
      } catch {
        horas = [0,0,0,0,0,0,0];
      }
    }
    if (!Array.isArray(horas)) horas = [0,0,0,0,0,0,0];
    const horasTotales = horas.reduce((sum, h) => sum + (Number(h) || 0), 0);
    return horasTotales * (empleado.pagoPorHora || 0);
  };

  return (
    <div>
      <h2>Sistema de Gestión de Sueldos Semanales</h2>
      
      <div>
        <button onClick={handleNuevo}>
          Nuevo Empleado
        </button>
      </div>

      <div>
        <h3>Lista de Empleados</h3>
        {empleados.length === 0 ? (
          <p>
            No hay empleados registrados. Haz clic en "Nuevo Empleado" para agregar uno.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Hrs Trabajadas/Semana</th>
                <th>Sueldo Semanal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => {
                let horas = empleado.horasPorDia;
                if (typeof horas === 'string') {
                  try {
                    horas = JSON.parse(horas);
                  } catch {
                    horas = [0,0,0,0,0,0,0];
                  }
                }
                if (!Array.isArray(horas)) horas = [0,0,0,0,0,0,0];
                const horasTotales = horas.reduce((sum, h) => sum + (Number(h) || 0), 0);
                const sueldo = calcularSueldoLocal(empleado);
                
                return (
                  <tr key={empleado.id}>
                    <td>{empleado.id}</td>
                    <td>{empleado.nombre}</td>
                    <td>{horasTotales} hrs</td>
                    <td>${sueldo.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleVer(empleado.id)}>
                        Ver
                      </button>
                      <button onClick={() => handleEditar(empleado.id)}>
                        Editar
                      </button>
                      <button onClick={() => handleEliminar(empleado.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {mostrarFormulario && (
        <EmpleadoForm
          empleadoId={empleadoSeleccionadoId}
          modoEdicion={modoEdicion}
          onSubmit={handleFormSubmit}
          onCancelar={handleCancelar}
        />
      )}

      {vistaDetalle && empleadoSeleccionadoId && !mostrarFormulario && (
        <EmpleadoDetalle empleadoId={empleadoSeleccionadoId} />
      )}
    </div>
  );
}

export default EmpleadoLista;