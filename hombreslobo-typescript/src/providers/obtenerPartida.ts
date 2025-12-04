import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export let partidaActual: any = null;

export const obtenerPartida = async (partidaId: string) => {


  try {
    const header = getJSONHeaders();
    const endpoint = `/partida/${partidaId}`;
    const res = await fetch(construirApi(endpoint), {
      headers: header,
    });

    const datos = await res.json();
    if (!res.ok) {
      console.error(datos.message || "Error desconocido");
      return null;
    }

    partidaActual = datos;
    return datos;
  } catch (error) {
    console.error("Error cargando partida:", error);
    return null;
  }
};
