import React, { useEffect, useState } from 'react';
import { crearEmpleado, actualizarEmpleado } from '../../services/sueldoService';

export default function SueldoForm({ empleado, onGuardado, onCancelar }) {
  const [form, setForm] = useState({ nombreCompleto: '', horasTrabajadas: 0, pagoPorHora: 0 });

  useEffect(() => {
    if (empleado) {
      // empleado puede ser objeto o id (en la lista se usa objeto para editar)
      setForm({
        nombreCompleto: empleado.nombreCompleto || empleado.nombre || '',
        horasTrabajadas: empleado.horasTrabajadas || 0,
        pagoPorHora: empleado.pagoPorHora || 0
      });
    }
  }, [empleado]);

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
      alert('Error guardando empleado');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
      <div>
        <label>Nombre:</label>
        <input value={form.nombreCompleto} onChange={e => setForm({ ...form, nombreCompleto: e.target.value })} required />
      </div>
      <div>
        <label>Horas trabajadas:</label>
        <input type="number" value={form.horasTrabajadas} onChange={e => setForm({ ...form, horasTrabajadas: Number(e.target.value) })} required />
      </div>
      <div>
        <label>Pago por hora:</label>
        <input type="number" value={form.pagoPorHora} onChange={e => setForm({ ...form, pagoPorHora: Number(e.target.value) })} required />
      </div>
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancelar} style={{ marginLeft: 8 }}>Cancelar</button>
    </form>
  );
}