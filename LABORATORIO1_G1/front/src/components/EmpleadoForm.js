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
      setForm({
        nombre: empleado.nombre || '',
        horasPorDia: empleado.horasPorDia || [0, 0, 0, 0, 0, 0, 0],
        pagoPorHora: empleado.pagoPorHora || 0
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
    try {
      if (empleado && empleado.id) {
        await actualizarEmpleado(empleado.id, form);
      } else {
        await crearEmpleado(form);
      }
      onGuardado && onGuardado();
    } catch (err) {
      console.error(err);
      alert('Error guardando empleado: ' + (err.message || err));
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 12, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
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
                value={form.horasPorDia[index]} 
                onChange={e => handleHoraChange(index, e.target.value)}
                style={{ width: '100%', padding: 5, textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>
          {empleado ? 'Actualizar' : 'Crear'}
        </button>
        <button 
          type="button" 
          onClick={onCancelar} 
          style={{ padding: '8px 20px', cursor: 'pointer', background: '#ccc' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}