import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const verificarHost = async (id_partida: any) => {
  try {
    const endpoint = "/partida/host";
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: getJSONHeaders(),
      body: JSON.stringify({
        id_partida: id_partida,
      }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    return data.esHost;
  } catch (error) {
    throw error;
  }
};
