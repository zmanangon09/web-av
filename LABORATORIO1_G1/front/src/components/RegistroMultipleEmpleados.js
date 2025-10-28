import React, { useState } from 'react';
import { crearEmpleado } from '../services/empleadoService';

export default function RegistroMultipleEmpleados({ numEmpleados, pagoPorHora, onCompleto, onCancelar }) {
  const [empleadoActual, setEmpleadoActual] = useState(0);
  const [empleados, setEmpleados] = useState([]);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const [form, setForm] = useState({
    nombre: '',
    horasPorDia: [0, 0, 0, 0, 0, 0, 0]
  });

  const handleHoraChange = (index, value) => {
    const nuevasHoras = [...form.horasPorDia];
    nuevasHoras[index] = Number(value) || 0;
    setForm({ ...form, horasPorDia: nuevasHoras });
  };

  async function handleSiguiente(e) {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert('Por favor ingrese el nombre del empleado');
      return;
    }

    try {
      await crearEmpleado({
        nombre: form.nombre,
        horasPorDia: form.horasPorDia,
        pagoPorHora: pagoPorHora
      });

      const nuevosEmpleados = [...empleados, { ...form, pagoPorHora }];
      setEmpleados(nuevosEmpleados);

      if (empleadoActual + 1 >= numEmpleados) {
        alert(`Se han registrado ${numEmpleados} empleado(s) exitosamente`);
        onCompleto();
      } else {
        setEmpleadoActual(empleadoActual + 1);
        setForm({ nombre: '', horasPorDia: [0,0,0,0,0,0,0] });
      }
    } catch (err) {
      console.error(err);
      alert('Error guardando empleado: ' + (err.message || err));
    }
  }

  const horasTotales = form.horasPorDia.reduce((sum, h) => sum + h, 0);
  const sueldoEstimado = horasTotales * pagoPorHora;

  return (
    <div align="center">
      <fieldset>
        <legend>Registro Múltiple de Empleados</legend>

        <div>
          <h3>Registrando Empleado {empleadoActual + 1} de {numEmpleados}</h3>
          <p>Pago configurado: ${pagoPorHora}/hora</p>
        </div>

        <form onSubmit={handleSiguiente}>
          <div>
            <label>Nombre Completo:&nbsp;</label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              required
              placeholder="Ej: Juan Perez"
              autoFocus
            />
          </div>
          <br />

          <div>
            <label>Horas trabajadas por día:</label>
            <div>
              {diasSemana.map((dia, index) => (
                <div key={index}>
                  <label>{dia}:&nbsp;</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={form.horasPorDia[index]}
                    onChange={e => handleHoraChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <br />

          <div>
            <div><strong>Total horas:</strong> {horasTotales} hrs</div>
            <div><strong>Sueldo semanal estimado:</strong> ${sueldoEstimado.toFixed(2)}</div>
          </div>
          <br />

          <div>
            <button type="submit">{empleadoActual + 1 >= numEmpleados ? 'Finalizar' : 'Siguiente Empleado'}</button>
            &nbsp;
            <button type="button" onClick={onCancelar}>Cancelar Registro</button>
          </div>
        </form>
      </fieldset>
    </div>
  );
}
