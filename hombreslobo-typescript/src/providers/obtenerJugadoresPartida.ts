import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerJugadoresPartida = async (partidaId: string) => {
  // 1. Obtener token
  const token = getToken();
  if (!token) {
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();

    const endpoint = `/partida/${partidaId}/jugadores`;

    const res = await fetch(construirApi(endpoint), {
      method: "GET",
      headers,
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    return {
      ok: true,
      jugadoresActuales: datos.jugadores_actuales,
      jugadoresMaximos: datos.jugadores_maximos,
      partidaId: datos.id_partida,
      listaJugadores: datos.lista_jugadores || [],
    };
  } catch (error) {
    console.error("Error cargando jugadores de la partida:", error);
    return { ok: false, error };
  }
};
