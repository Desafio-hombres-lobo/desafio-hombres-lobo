import { construirApi } from "../autenticacion/ts/apiFetch";
import { getJSONHeaders } from "../autenticacion/ts/header";

export const enviarDatosCrearPartida = async (datosPartida: any) => {
  try {
    const endpoint = "/crearPartida";
    const headers = getJSONHeaders();
    const response = await fetch(construirApi(endpoint), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(datosPartida),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        mensaje: data.message ?? "Error desconocido",
      };
    }

    return {
      ok: true,
      mensaje: "Partida creada correctamente",
      partida: { id: data.partida?.id },
    };
  } catch (error) {
    return {
      ok: false,
      mensaje: "Error en la solicitud.",
    };
  }
};
