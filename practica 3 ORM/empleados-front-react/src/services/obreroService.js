// src/services/obreroService.js

const API_URL = "http://localhost:3000/api/obreros";

// Obtener todos los obreros
export async function obtenerObreros() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener obreros");
  return await response.json();
}

// Crear un nuevo obrero
export async function crearObrero(obreroData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obreroData),
  });
  if (!response.ok) throw new Error("Error al crear obrero");
  return await response.json();
}

// Actualizar obrero
export async function actualizarObrero(id, obreroData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obreroData),
  });
  if (!response.ok) throw new Error("Error al actualizar obrero");
  return await response.json();
}

// Eliminar obrero
export async function eliminarObrero(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar obrero");
  return await response.json();
}

// Calcular salario semanal
export async function calcularSalario(id) {
  const response = await fetch(`${API_URL}/${id}/salario`);
  if (!response.ok) throw new Error("Error al calcular salario");
  return await response.json();
}