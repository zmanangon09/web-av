import React, { useState, useEffect } from 'react';
import { obtenerObreros, eliminarObrero } from '../services/obreroService.js';
import ObreroDetalle from './obreroDetalle.js';
import ObreroForm from './obreroForm.js';

function ObreroLista() {
  const [obreros, setObreros] = useState([]);
  const [obreroSeleccionado, setObreroSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    cargarObreros();
  }, []);

  const cargarObreros = async () => {
    const data = await obtenerObreros();
    setObreros(data);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este obrero?')) return;
    await eliminarObrero(id);
    cargarObreros();
  };

  const handleVer = (obrero) => {
    setObreroSeleccionado(obrero);
    setMostrarFormulario(false);
  };

  const handleNuevo = () => {
    setModoEdicion(false);
    setObreroSeleccionado(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (obrero) => {
    setModoEdicion(true);
    setObreroSeleccionado(obrero);
    setMostrarFormulario(true);
  };

  const handleFormSubmit = async () => {
    setMostrarFormulario(false);
    setObreroSeleccionado(null);
    await cargarObreros();
  };

  return (
    <div>
      <h2>Lista de Obreros</h2>
      <button onClick={handleNuevo}>Nuevo Obrero</button>

      {obreros.length === 0 ? (
        <p>No hay obreros registrados.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Horas Trabajadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obreros.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.nombreCompleto}</td>
                <td>{o.horasTrabajadas}</td>
                <td>
                  <button onClick={() => handleVer(o)}>Ver</button>{" "}
                  <button onClick={() => handleEditar(o)}>Editar</button>{" "}
                  <button onClick={() => handleEliminar(o.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarFormulario ? (
        <ObreroForm
          obrero={obreroSeleccionado}
          modoEdicion={modoEdicion}
          onSubmit={handleFormSubmit}
          onCancelar={() => setMostrarFormulario(false)}
        />
      ) : obreroSeleccionado ? (
        <ObreroDetalle obrero={obreroSeleccionado} />
      ) : (
        <p>Selecciona un obrero o crea uno nuevo.</p>
      )}
    </div>
  );
}

export default ObreroLista;
