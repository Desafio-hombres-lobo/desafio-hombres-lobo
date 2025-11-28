import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarMensaje = async (mensaje: string, partida_id: any) => {
  try {
    const endpoint = "/chat/lobos";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({ mensaje, partida_id }),
    });
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
