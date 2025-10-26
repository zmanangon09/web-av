import React, { useState, useEffect } from 'react';
import { crearObrero, actualizarObrero } from '../services/obreroService.js';


function ObreroForm({ obrero, modoEdicion, onSubmit, onCancelar }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    horasTrabajadas: ''
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (modoEdicion && obrero) {
      setFormData({
        nombreCompleto: obrero.nombreCompleto,
        horasTrabajadas: obrero.horasTrabajadas
      });
    } else {
      setFormData({
        nombreCompleto: '',
        horasTrabajadas: ''
      });
    }
  }, [obrero, modoEdicion]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre es obligatorio';
    }
    
    if (!formData.horasTrabajadas) {
      nuevosErrores.horasTrabajadas = 'Las horas trabajadas son obligatorias';
    } else if (formData.horasTrabajadas < 0) {
      nuevosErrores.horasTrabajadas = 'Las horas no pueden ser negativas';
    } else if (formData.horasTrabajadas > 168) {
      nuevosErrores.horasTrabajadas = 'No puede trabajar más de 168 horas por semana';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'horasTrabajadas' ? Number(value) : value
    }));
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      setEnviando(true);
      
      if (modoEdicion) {
        await actualizarObrero(obrero.id, formData);
      } else {
        await crearObrero(formData);
      }
      
      onSubmit();
    } catch (err) {
      alert(`Error al ${modoEdicion ? 'actualizar' : 'crear'} el obrero`);
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="obrero-form">
      <h3>{modoEdicion ? 'Editar Obrero' : 'Nuevo Obrero'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombreCompleto">Nombre Completo *</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            className={errores.nombreCompleto ? 'input-error' : ''}
            placeholder="Ej: Juan Pérez"
          />
          {errores.nombreCompleto && (
            <span className="error-message">{errores.nombreCompleto}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="horasTrabajadas">Horas Trabajadas *</label>
          <input
            type="number"
            id="horasTrabajadas"
            name="horasTrabajadas"
            value={formData.horasTrabajadas}
            onChange={handleChange}
            className={errores.horasTrabajadas ? 'input-error' : ''}
            placeholder="Ej: 40"
            min="0"
            max="168"
          />
          {errores.horasTrabajadas && (
            <span className="error-message">{errores.horasTrabajadas}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando}
          >
            {enviando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ObreroForm;