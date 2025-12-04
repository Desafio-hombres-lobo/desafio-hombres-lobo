import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerDatosJugadoresPartida = async (
  idPartida: number | string
): Promise<any> => {
  const token = getToken();

  if (!token) {
    alert("Error: No estás autenticado. Por favor, inicia sesión.");
    return;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = `/datosJugadoresPartida/${idPartida}`;
    const response = await fetch(construirApi(endpoint), {
      method: "GET",
      headers: header,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();
    const datosJugadoresPartida = json.data;

    return datosJugadoresPartida;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return;
  }
};
