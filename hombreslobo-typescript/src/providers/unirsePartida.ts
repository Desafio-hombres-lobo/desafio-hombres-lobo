import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const unirsePartida = async (payload: {
  game_id: string | number;
  player: string;
  timestamp: string;
}) => {
  const token = getToken();
  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return { ok: false, error: "No autenticado" };
  }

  try {
    const headers = getJSONHeaders();
    const endpoint = "/game/join";

    const res = await fetch(construirApi(endpoint), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const datos = await res.json();

    if (!res.ok) {
      return { ok: false, error: datos };
    }

    return { ok: true, datos };
  } catch (error) {
    console.error("Error cargando partida:", error);
    return { ok: false, error };
  }
};
