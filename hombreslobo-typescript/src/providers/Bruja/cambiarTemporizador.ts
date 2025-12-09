import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const cambiarTemporizador = async (
  idPartida: number | string,
  segundos: number,
) => {
  const token = getToken();
  if (!token) return { ok: false, error: "No autenticado" };

  try {
    const headers = getJSONHeaders();
    const endpoint = `/partidas/${idPartida}/cambiarTemporizador`;

    const res = await fetch(construirApi(endpoint), {
      method: "GET",
      headers: headers,
      body: JSON.stringify({segundos}),
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};