import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};
