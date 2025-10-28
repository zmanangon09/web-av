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
      // Crear el empleado con el pago por hora configurado
      await crearEmpleado({
        nombre: form.nombre,
        horasPorDia: form.horasPorDia,
        pagoPorHora: pagoPorHora
      });

      const nuevosEmpleados = [...empleados, { ...form, pagoPorHora }];
      setEmpleados(nuevosEmpleados);

      // Si ya registramos todos los empleados
      if (empleadoActual + 1 >= numEmpleados) {
        alert(`✅ Se han registrado ${numEmpleados} empleado(s) exitosamente`);
        onCompleto();
      } else {
        // Pasar al siguiente empleado
        setEmpleadoActual(empleadoActual + 1);
        setForm({ nombre: '', horasPorDia: [0, 0, 0, 0, 0, 0, 0] });
      }
    } catch (err) {
      console.error(err);
      alert('Error guardando empleado: ' + (err.message || err));
    }
  }

  const horasTotales = form.horasPorDia.reduce((sum, h) => sum + h, 0);
  const sueldoEstimado = horasTotales * pagoPorHora;

  return (
    <div style={{ 
      marginTop: 20, 
      padding: 20, 
      border: '2px solid #2ecc71', 
      borderRadius: 8,
      backgroundColor: '#e8f8f5',
      maxWidth: '800px',
      margin: '20px auto'
    }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <h3 style={{ color: '#27ae60', marginBottom: 10 }}>
          👤 Registrando Empleado {empleadoActual + 1} de {numEmpleados}
        </h3>
        <div style={{ 
          backgroundColor: '#27ae60', 
          height: '8px', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#2ecc71',
            height: '100%',
            width: `${((empleadoActual + 1) / numEmpleados) * 100}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <p style={{ marginTop: 10, color: '#555', fontSize: '14px' }}>
          💵 Pago configurado: <strong>${pagoPorHora}/hora</strong>
        </p>
      </div>

      <form onSubmit={handleSiguiente}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            📝 Nombre Completo:
          </label>
          <input 
            type="text"
            value={form.nombre} 
            onChange={e => setForm({ ...form, nombre: e.target.value })} 
            required 
            placeholder="Ej: Juan Pérez"
            autoFocus
            style={{ 
              width: '100%', 
              padding: 10,
              fontSize: '16px',
              border: '1px solid #bdc3c7',
              borderRadius: 4
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}>
            ⏰ Horas trabajadas por día:
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
            gap: 10 
          }}>
            {diasSemana.map((dia, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.9em', marginBottom: 5, fontWeight: '500' }}>
                  {dia}
                </label>
                <input 
                  type="number" 
                  min="0"
                  max="24"
                  value={form.horasPorDia[index]} 
                  onChange={e => handleHoraChange(index, e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    textAlign: 'center',
                    border: '1px solid #bdc3c7',
                    borderRadius: 4,
                    fontSize: '14px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff', 
          padding: 15, 
          borderRadius: 5, 
          marginBottom: 20,
          border: '1px solid #bdc3c7'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span><strong>Total horas:</strong></span>
            <span>{horasTotales} hrs</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontSize: '18px' }}>
            <span><strong>Sueldo semanal estimado:</strong></span>
            <span><strong>${sueldoEstimado.toFixed(2)}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button 
            type="submit" 
            style={{ 
              padding: '12px 30px', 
              cursor: 'pointer',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {empleadoActual + 1 >= numEmpleados ? '✅ Finalizar' : '➡️ Siguiente Empleado'}
          </button>
          <button 
            type="button" 
            onClick={onCancelar} 
            style={{ 
              padding: '12px 30px', 
              cursor: 'pointer',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: '16px'
            }}
          >
            ✖️ Cancelar Registro
          </button>
        </div>
      </form>
    </div>
  );
}
