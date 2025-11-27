import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const actualizarEstadoPartida = async (
  partidaId: string,
  estado: 0 | 1 | 2 | 3
) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();

    const endpoint = `/${partidaId}/llena`;

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify({ estado }),
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    console.log(`Estado actualizado a ${estado}`, datos);
    return { ok: true, datos };
  } catch (error) {
    console.error("Error actualizando estado de la partida:", error);
    return { ok: false, error };
  }
};

