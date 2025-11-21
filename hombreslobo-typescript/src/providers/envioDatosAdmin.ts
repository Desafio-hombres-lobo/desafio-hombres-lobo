import { getToken } from "../autenticacion/ts/auth";
const api = "http://127.0.0.1:8000/api/users";

export const cogerUsuarios = () => {};

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
    ...options,
    headers: headers,
  });

  if (!response.ok) {
    throw response;
  }

  if (options.method === "DELETE" && response.status === 204) {
    return { message: "Usuario borrado con éxito" };
  }

  return response.json();
}

/**
 * Obtiene la lista completa de usuarios.
 */
export function cogerTodosLosUsuarios() {
  return apiFetch("/users");
}

/**
 * Obtiene un solo usuario por ID o Nickname.
 */
export function cogerUnUsuario(id: string | number) {
  return apiFetch(`/users/${id}`);
}

/**
 * Borra un usuario por ID o Nickname.
 */
export function borrarUsuario(id: string | number) {
  return apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
}

/**
 * Actualiza un usuario.
 */
export function actualizarUsuario(id: string | number, datos: any) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}
