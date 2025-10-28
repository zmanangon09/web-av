import React, { useEffect, useState } from 'react';
import { crearEmpleado, actualizarEmpleado } from '../services/empleadoService';

export default function EmpleadoForm({ empleado, onGuardado, onCancelar }) {
  // Estado inicial con array de 7 días para las horas
  const [form, setForm] = useState({ 
    nombre: '', 
    horasPorDia: [0, 0, 0, 0, 0, 0, 0], 
    pagoPorHora: 0 
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (empleado) {
      // Asegurar que horasPorDia sea un array
      let horasPorDia = empleado.horasPorDia || [0, 0, 0, 0, 0, 0, 0];
      
      // Si es string, parsearlo
      if (typeof horasPorDia === 'string') {
        try {
          horasPorDia = JSON.parse(horasPorDia);
        } catch {
          horasPorDia = [0, 0, 0, 0, 0, 0, 0];
        }
      }
      
      // Si no es array, usar por defecto
      if (!Array.isArray(horasPorDia)) {
        horasPorDia = [0, 0, 0, 0, 0, 0, 0];
      }
      
      // Asegurar que tenga 7 elementos
      while (horasPorDia.length < 7) {
        horasPorDia.push(0);
      }
      
      setForm({
        nombre: empleado.nombre || '',
        horasPorDia: horasPorDia,
        pagoPorHora: empleado.pagoPorHora || 0
      });
    } else {
      // Reset para nuevo empleado
      setForm({
        nombre: '', 
        horasPorDia: [0, 0, 0, 0, 0, 0, 0], 
        pagoPorHora: 0 
      });
    }
  }, [empleado]);

  const handleHoraChange = (index, value) => {
    const nuevasHoras = [...form.horasPorDia];
    nuevasHoras[index] = Number(value) || 0;
    setForm({ ...form, horasPorDia: nuevasHoras });
  };

  async function onSubmit(e) {
    e.preventDefault();
    
    // Validar que el nombre no esté vacío
    if (!form.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }
    
    // Validar que el pago por hora sea mayor a 0
    if (form.pagoPorHora <= 0) {
      alert('El pago por hora debe ser mayor a 0');
      return;
    }
    
    // Preparar datos asegurando que horasPorDia sea un array
    const datosEmpleado = {
      nombre: form.nombre.trim(),
      horasPorDia: form.horasPorDia.map(h => Number(h) || 0),
      pagoPorHora: Number(form.pagoPorHora)
    };
    
    try {
      if (empleado && empleado.id) {
        await actualizarEmpleado(empleado.id, datosEmpleado);
      } else {
        await crearEmpleado(datosEmpleado);
      }
      onGuardado && onGuardado();
    } catch (err) {
      console.error(err);
      alert('Error guardando empleado: ' + (err.message || err));
    }
  }

  const horasTotales = form.horasPorDia.reduce((sum, h) => sum + (Number(h) || 0), 0);
  const sueldoEstimado = horasTotales * (Number(form.pagoPorHora) || 0);

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 12, padding: 15, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
      <h3>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
      
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Nombre Completo:</strong>
        </label>
        <input 
          type="text"
          value={form.nombre} 
          onChange={e => setForm({ ...form, nombre: e.target.value })} 
          required 
          placeholder="Ej: Juan Pérez"
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Pago por Hora ($):</strong>
        </label>
        <input 
          type="number" 
          step="0.01"
          min="0.01"
          value={form.pagoPorHora} 
          onChange={e => setForm({ ...form, pagoPorHora: Number(e.target.value) })} 
          required 
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 10 }}>
          <strong>Horas trabajadas por día:</strong>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {diasSemana.map((dia, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.85em', marginBottom: 4 }}>
                {dia.substring(0, 3)}
              </label>
              <input 
                type="number" 
                min="0"
                max="24"
                step="0.5"
                value={form.horasPorDia[index]} 
                onChange={e => handleHoraChange(index, e.target.value)}
                style={{ width: '100%', padding: 5, textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
        <div style={{ 
          marginTop: 10, 
          padding: 10, 
          backgroundColor: '#e8f8f5', 
          borderRadius: 5,
          border: '1px solid #27ae60'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span><strong>Total horas:</strong> {horasTotales} hrs</span>
            <span style={{ color: '#27ae60' }}><strong>Sueldo estimado:</strong> ${sueldoEstimado.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={{ 
          padding: '8px 20px', 
          cursor: 'pointer',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: 5
        }}>
          {empleado ? 'Actualizar' : 'Crear'}
        </button>
        <button 
          type="button" 
          onClick={onCancelar} 
          style={{ 
            padding: '8px 20px', 
            cursor: 'pointer', 
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: 5
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}