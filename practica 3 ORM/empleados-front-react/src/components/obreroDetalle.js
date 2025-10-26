import React, { useState, useEffect } from 'react';
import { calcularSalario } from '../services/obreroService.js';

function ObreroDetalle({ obrero }) {
  const [salario, setSalario] = useState(null);

  useEffect(() => {
    const cargarSalario = async () => {
      const data = await calcularSalario(obrero.id);
      setSalario(data);
    };
    cargarSalario();
  }, [obrero]);

  if (!salario) {
    return <p>Calculando salario...</p>;
  }

  return (
    <div >
      <h3>Detalle del Obrero #{obrero.id}</h3>
      <p><b>Nombre:</b> {obrero.nombreCompleto}</p>
      <p><b>Horas trabajadas:</b> {obrero.horasTrabajadas}</p>
      <p><b>Horas normales (máx. 40h):</b> {salario.horasNormales} hrs = ${salario.pagoNormal}</p>
      <p><b>Horas extras:</b> {salario.horasExtras} hrs = ${salario.pagoExtra}</p>
      <p><b>Total a pagar:</b> ${salario.total}</p>
    </div>
  );
}

export default ObreroDetalle;
