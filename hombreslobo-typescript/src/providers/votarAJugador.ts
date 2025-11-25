import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const votarAJugador = async (
  idJugador: number,
  idPartida: number,
  estado: number
) => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/cambiarEstadoDePersonaje";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        id_jugador: idJugador,
        id_partida: idPartida,
        estado: estado,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    const jugadorVotado = data;

    return jugadorVotado;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
