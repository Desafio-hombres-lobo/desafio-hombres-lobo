import { construirApi } from "../../autenticacion/ts/apiFetch";
import { getToken } from "../../autenticacion/ts/auth";
import { getJSONHeaders } from "../../autenticacion/ts/header";

export const actualizarEstadoJugador = async (
  partidaId: string,
  jugador:number
) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();

    const endpoint = `/partida/${partidaId}/eliminar-jugador/${jugador}`;

    const res = await fetch(construirApi(endpoint), {
      method: "PUT",
      headers,
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    console.log(`Estado actualizado a eliminado`, datos);
    return { ok: true, datos };
  } catch (error) {
    console.error("Error actualizando estado del jugador:", error);
    return { ok: false, error };
  }
};