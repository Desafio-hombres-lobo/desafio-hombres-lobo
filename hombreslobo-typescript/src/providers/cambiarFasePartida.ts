import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const cambiarFasePartida = async (id_partida: any, fase: boolean) => {
  try {
    const endpoint = "/partida/cambiarFase";
    let faseRespuesta;
    if (fase) {
      faseRespuesta = "dia";
    } else {
      faseRespuesta = "noche";
    }
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({
        id_partida,
        fase: faseRespuesta,
      }),
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
