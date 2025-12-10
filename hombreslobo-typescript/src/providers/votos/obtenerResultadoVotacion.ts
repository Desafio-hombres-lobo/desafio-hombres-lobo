import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const obtenerResultadoVotacion = async (
  idPartida: number,
  ronda: number
) => {
  const token = getToken();
  if (!token) return { ok: false, error: "No autenticado" };

  try {
    const endpoint = `/partidas/${idPartida}/resultado/${ronda}`;

    const res = await fetch(construirApi(endpoint), {
      method: "GET",
      headers: getJSONHeaders(),
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};
