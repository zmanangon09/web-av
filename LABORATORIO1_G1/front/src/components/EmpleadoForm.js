import React, { useEffect, useState } from 'react';
import { crearEmpleado, actualizarEmpleado } from '../services/empleadoService';

export default function EmpleadoForm({ empleado, onGuardado, onCancelar }) {
  const [form, setForm] = useState({
    nombre: '',
    horasPorDia: [0, 0, 0, 0, 0, 0, 0],
    pagoPorHora: 0
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (empleado) {
      let horasPorDia = empleado.horasPorDia || [0, 0, 0, 0, 0, 0, 0];
      if (typeof horasPorDia === 'string') {
        try { horasPorDia = JSON.parse(horasPorDia); } catch { horasPorDia = [0,0,0,0,0,0,0]; }
      }
      if (!Array.isArray(horasPorDia)) horasPorDia = [0,0,0,0,0,0,0];
      while (horasPorDia.length < 7) horasPorDia.push(0);
      setForm({ nombre: empleado.nombre || '', horasPorDia, pagoPorHora: empleado.pagoPorHora || 0 });
    } else {
      setForm({ nombre: '', horasPorDia: [0,0,0,0,0,0,0], pagoPorHora: 0 });
    }
  }, [empleado]);

  const handleHoraChange = (index, value) => {
    const nuevas = [...form.horasPorDia];
    nuevas[index] = Number(value) || 0;
    setForm({ ...form, horasPorDia: nuevas });
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) { alert('El nombre es requerido'); return; }
    if (form.pagoPorHora <= 0) { alert('El pago por hora debe ser mayor a 0'); return; }

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
    <div align="center">
      <fieldset>
        <legend>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</legend>

        <form onSubmit={onSubmit}>
          <div>
            <label>Nombre Completo:&nbsp;</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              required
              placeholder="Juan P."
              autoFocus
            />
          </div>
          <br />

          <div>
            <label>Pago por Hora ($):&nbsp;</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.pagoPorHora}
              onChange={e => setForm({ ...form, pagoPorHora: Number(e.target.value) })}
              required
              placeholder="10.00"
            />
          </div>
          <br />

          <div>
            <label>Horas trabajadas por día:</label>
            <div>
              {diasSemana.map((dia, index) => (
                <div key={index}>
                  <label>{dia.substring(0,3)}:&nbsp;</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={form.horasPorDia[index]}
                    onChange={e => handleHoraChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <br />
            <div>
              <strong>Total horas:</strong> {horasTotales} hrs
            </div>
            <div>
              <strong>Sueldo estimado:</strong> ${sueldoEstimado.toFixed(2)}
            </div>
          </div>
          <br />

          <div>
            <button type="submit">{empleado ? 'Actualizar' : 'Crear'}</button>
            &nbsp;
            <button type="button" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </fieldset>
    </div>
  );
}