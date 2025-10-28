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
    <div style={{ 
      marginTop: 20, 
      padding: 20, 
      border: '2px solid #3498db', 
      borderRadius: 8,
      backgroundColor: '#ecf0f1',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: 15 }}>⚙️ Configuración de Nómina</h3>
      <p style={{ marginBottom: 20, color: '#555' }}>
        Configure el número de empleados a registrar y el pago por hora que recibirán.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            👥 Número de Empleados:
          </label>
          <input 
            type="number"
            min="1"
            max="50"
            value={numEmpleados} 
            onChange={e => setNumEmpleados(e.target.value)} 
            required 
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
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
            💵 Pago por Hora ($):
          </label>
          <input 
            type="number"
            min="0.01"
            step="0.01"
            value={pagoPorHora} 
            onChange={e => setPagoPorHora(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: 10, 
              fontSize: '16px',
              border: '1px solid #bdc3c7',
              borderRadius: 4
            }}
          />
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
            ✅ Iniciar Registro
          </button>
          <button 
            type="button" 
            onClick={onCancelar} 
            style={{ 
              padding: '12px 30px', 
              cursor: 'pointer',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: '16px'
            }}
          >
            ✖️ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
