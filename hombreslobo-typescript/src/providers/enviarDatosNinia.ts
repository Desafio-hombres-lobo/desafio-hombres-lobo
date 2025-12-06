import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const verNinia = async (idPartida: number | string) => {
  const token = getToken();
  if (!token) return { ok: false, error: "No autenticado" };

  try {
    const headers = getJSONHeaders();
    const endpoint = `/partidas/${idPartida}/ninia`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
    });

    const datos = await res.json();
    if (!res.ok) return { ok: false, error: datos };

    return { ok: true, datos };
  } catch (error) {
    return { ok: false, error };
  }
};
