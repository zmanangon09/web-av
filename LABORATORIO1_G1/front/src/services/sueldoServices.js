// Servicio HTTP para consumir el backend en http://localhost:3000
const BASE = 'http://localhost:3000/empleados';

export async function listarEmpleados() {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Error al listar empleados');
    return await res.json();
}

export async function obtenerEmpleado(id) {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error('Empleado no encontrado');
    return await res.json();
}

export async function crearEmpleado(payload) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Error al crear empleado');
    return await res.json();
}

export async function actualizarEmpleado(id, payload) {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Error al actualizar empleado');
    return await res.json();
}

export async function eliminarEmpleado(id) {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar empleado');
    return;
}