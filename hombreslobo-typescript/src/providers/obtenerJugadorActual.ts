import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerJugadorActual = async () => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();
    const endpoint = "/jugador";

    const res = await fetch(construirApi(endpoint), {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const datos = await res.json();
      return { ok: false, error: datos };
    }

    const datos = await res.json();
    return { ok: true, datos };

  } catch (error) {
    console.error("Error obteniendo jugador actual:", error);
    return { ok: false, error };
  }
};

