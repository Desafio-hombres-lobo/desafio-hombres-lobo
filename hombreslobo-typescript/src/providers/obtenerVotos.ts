import { construirApi } from "../autenticacion/ts/apiFetch";
import { getToken } from "../autenticacion/ts/auth";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const obtenerJugadorMasVotado = async (idPartida: number) => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const header = getJSONHeaders();
    const endpoint = "/resolverVotos";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        id_partida: idPartida,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    const recuentoVotos = data;

    // BORRAR
    console.log(recuentoVotos);

    return recuentoVotos;
  } catch (error) {
    console.error("Error en la solicitud: " + error);
    return null;
  }
};
