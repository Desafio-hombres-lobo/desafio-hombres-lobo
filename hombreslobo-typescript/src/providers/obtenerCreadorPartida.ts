export const obtenerCreadorPartida = async (token: string, idPartida: string | number) => {
  return fetch(`http://127.0.0.1:8000/api/creadorPartida/${idPartida}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
};import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerCreador = async (creadorId: string) => {
  const token = getToken();

  if (!token) {
    console.error("No hay token de autenticación");
    return null;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = `/jugador/${creadorId}`;
    const res = await fetch(construirApi(endpoint), {
      headers: header,
    });

    const creador = await res.json();
    if (!res.ok) {
      console.error(creador.message || "Error desconocido");
      return null;
    }

    return creador;
  } catch (error) {
    console.error("Error cargando creador de la partida:", error);
    return null;
  }
};