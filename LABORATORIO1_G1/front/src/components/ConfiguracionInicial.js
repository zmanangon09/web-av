import React, { useState } from 'react';

export default function ConfiguracionInicial({ onIniciar, onCancelar }) {
  const [numEmpleados, setNumEmpleados] = useState(1);
  const [pagoPorHora, setPagoPorHora] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    if (numEmpleados < 1) {
      alert('Debe ingresar al menos 1 empleado');
      return;
    }
    if (pagoPorHora <= 0) {
      alert('El pago por hora debe ser mayor a 0');
      return;
    }
    onIniciar({ numEmpleados: parseInt(numEmpleados), pagoPorHora: parseFloat(pagoPorHora) });
  }

  return (
    <div align="center">
      <fieldset>
        <legend>Configuración de Nómina</legend>

        <p>Configure el número de empleados a registrar y el pago por hora.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Número de Empleados:&nbsp;</label>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="3"
              value={numEmpleados}
              onChange={e => setNumEmpleados(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label>Pago por Hora ($):&nbsp;</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10.00"
              value={pagoPorHora}
              onChange={e => setPagoPorHora(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <button type="submit">Iniciar Registro</button>
            &nbsp;
            <button type="button" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </fieldset>
    </div>
  );
}
