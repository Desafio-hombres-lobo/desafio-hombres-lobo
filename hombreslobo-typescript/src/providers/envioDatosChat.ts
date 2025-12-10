import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarMensaje = async (mensaje: string, id_partida: any) => {
  try {
    const endpoint = "/chat/aldea";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({ mensaje, id_partida }),
    });
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
