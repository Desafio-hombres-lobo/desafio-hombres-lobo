import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const salirPartida = async (partidaId: string) => {
  const token = getToken();
  if (!token) {
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();

    const endpoint = "/partida/abandonar";

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify({
        id_partida: partidaId,
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
