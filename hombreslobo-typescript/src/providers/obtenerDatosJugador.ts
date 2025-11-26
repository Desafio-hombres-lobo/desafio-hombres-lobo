import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerDatosJugadorPartida = async (
  idJugador: number,
  idPartida: number
): Promise<any> => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/datosJugadorPartida";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        id_jugador: idJugador,
        id_partida: idPartida,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();
    const datosJugadorPartida = json.data;

    return datosJugadorPartida;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return;
  }
};
