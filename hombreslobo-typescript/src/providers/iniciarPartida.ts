import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const iniciarPartida = async (partidaId: string) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();

    const endpoint = `/${partidaId}/iniciar`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers,
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    console.log(`Partida ${partidaId} iniciada`, datos);
    return { ok: true, datos };
  } catch (error) {
    console.error("Error iniciando partida:", error);
    return { ok: false, error };
  }
};
