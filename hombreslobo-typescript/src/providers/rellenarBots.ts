import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const rellenarBotsPartida = async (
  idPartida: string,
  numJugadores: number
) => {
  const token = getToken();
  if (!token) {
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();
    const endpoint = `/rellenar/partida/${idPartida}`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify({ numJugadores }),
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    return { ok: true, datos };
  } catch (error) {
    console.error("Error rellenando bots:", error);
    return { ok: false, error };
  }
};
