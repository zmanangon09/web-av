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
    const horasTotales = empleado.horasPorDia.reduce((sum, h) => sum + h, 0);
    return horasTotales * empleado.pagoPorHora;
  };

  return (
    <div className="empleado-lista-container">
      <h2>📋 Sistema de Gestión de Sueldos Semanales</h2>
      
      <div className="acciones-principales">
        <button onClick={handleNuevo} className="btn btn-primary">
          ➕ Nuevo Empleado
        </button>
      </div>

      <div className="tabla-container">
        <h3>Lista de Empleados</h3>
        {empleados.length === 0 ? (
          <p className="mensaje-vacio">
            No hay empleados registrados. Haz clic en "Nuevo Empleado" para agregar uno.
          </p>
        ) : (
          <table className="tabla-empleados">
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
                const sueldo = calcularSueldoLocal(empleado);
                const horasTotales = empleado.horasPorDia.reduce((sum, h) => sum + h, 0);
                
                return (
                  <tr key={empleado.id}>
                    <td>{empleado.id}</td>
                    <td>{empleado.nombre}</td>
                    <td>{horasTotales} hrs</td>
                    <td>${sueldo.toFixed(2)}</td>
                    <td className="acciones">
                      <button 
                        onClick={() => handleVer(empleado.id)}
                        className="btn btn-info"
                      >
                        👁️ Ver
                      </button>
                      <button 
                        onClick={() => handleEditar(empleado.id)}
                        className="btn btn-warning"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleEliminar(empleado.id)}
                        className="btn btn-danger"
                      >
                        🗑️ Eliminar
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