import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const verificarHost = async (partida_id: any) => {
  try {
    const endpoint = "/partida/host";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({
        partida_id: partida_id,
      }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    return data.esHost;
  } catch (error) {
    throw error;
  }
};
