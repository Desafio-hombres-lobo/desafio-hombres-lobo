import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";


export const obtenerCreadorPartida = async (idPartida: string | number) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();
    const endpoint = `/creadorPartida/${idPartida}`;

    const res = await fetch(construirApi(endpoint), {
      method: "GET",
      headers,
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    return { ok: true, datos };
  } catch (error) {
    console.error("Error obteniendo creador de la partida:", error);
    return { ok: false, error };
  }
};

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

export const verificarHost = async (id_partida: any) => {
  try {
    const endpoint = "/partida/host";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({
        id_partida: id_partida,
      }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    return data.esHost;
  } catch (error) {
    throw error;
  }
};