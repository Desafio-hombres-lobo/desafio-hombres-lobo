import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const eliminarJugador = async (
  idPartida: number | string,
  idEliminado: number,
) => {
  const token = getToken();
  if (!token) return { ok: false, error: "No autenticado" };

  try {
    const headers = getJSONHeaders();
    const endpoint = `/partidas/bruja-eliminar`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: JSON.stringify({idPartida, idEliminado}),
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};