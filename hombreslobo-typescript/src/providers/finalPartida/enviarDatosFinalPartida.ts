import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const ganarPartida = async (partidaId: string, idJugador:number) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {

    const headers = getJSONHeaders();

    const endpoint = `/partida/${partidaId}/ganar`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        idJugador: idJugador
      }),
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }


    return { ok: true, datos };
  } catch (error) {
    console.error("Error al abandonar la partida:", error);
    return { ok: false, error };
  }
};

export const perderPartida = async (partidaId: string, idJugador:number) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {

    const headers = getJSONHeaders();

    const endpoint = `/partida/${partidaId}/perder`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        idJugador: idJugador
      }),
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }


    return { ok: true, datos };
  } catch (error) {
    console.error("Error al abandonar la partida:", error);
    return { ok: false, error };
  }
};

