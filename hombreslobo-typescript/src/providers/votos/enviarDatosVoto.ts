import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const votar = async (
  idPartida: number | string,
  payload: {
    id_jugador: number;
    id_jugador_votado: number;
    ronda: number;
  }
) => {
  const token = getToken();
  if (!token) return { ok: false, error: "No autenticado" };

  try {
    const headers = getJSONHeaders();
    const endpoint = `/partidas/${idPartida}/votar`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};
