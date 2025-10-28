const API_URL = 'http://localhost:3000/api';

export const crearEmpleado = async (datos) => {
  const response = await fetch(`${API_URL}/empleados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear empleado');
  }
  
  return response.json();
};

export const listarEmpleados = async () => {
  const response = await fetch(`${API_URL}/empleados`);
  return response.json();
};

export const obtenerEmpleados = async () => {
  const response = await fetch(`${API_URL}/empleados`);
  return response.json();
};

export const obtenerEmpleado = async (id) => {
  const response = await fetch(`${API_URL}/empleados/${id}`);
  return response.json();
};

export const calcularSueldo = async (id) => {
  const response = await fetch(`${API_URL}/empleados/${id}/sueldo`);
  return response.json();
};

export const actualizarEmpleado = async (id, datos) => {
  const response = await fetch(`${API_URL}/empleados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar empleado');
  }
  
  return response.json();
};

export const eliminarEmpleado = async (id) => {
  const response = await fetch(`${API_URL}/empleados/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar empleado');
  }
  
  return response.json();
};

export const obtenerResumen = async () => {
  const response = await fetch(`${API_URL}/empleados/resumen`);
  return response.json();
};